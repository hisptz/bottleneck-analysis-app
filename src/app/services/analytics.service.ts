import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Constants} from "./constants";
import * as _ from 'lodash';
import {Visualization} from "../model/visualization";

@Injectable()
export class AnalyticsService {

  constructor(
    private constant: Constants,
    private http: Http
  ) { }

  public getAnalytic(visualizationObject: Visualization): Observable<Visualization> {
    return Observable.create(observer => {
      let analyticCallAArray: any[] = [];
      visualizationObject.layers.forEach(layer => {
        if(visualizationObject.type == 'MAP') {
          if (layer.settings.layer != 'boundary' && layer.settings.layer != 'external' && layer.settings.layer != 'earthEngine' && layer.settings.layer != 'facility') {
            analyticCallAArray.push(this.http.get(this.constructUrl(layer.settings, visualizationObject.type, visualizationObject.details.filters))
              .map((res: Response) => res.json())
              .catch(error => Observable.throw(new Error(error))))
          }
        } else {
          analyticCallAArray.push(this.http.get(this.constructUrl(layer.settings, visualizationObject.type, visualizationObject.details.filters))
            .map((res: Response) => res.json())
            .catch(error => Observable.throw(new Error(error))))
        }
      });

      if(analyticCallAArray.length > 0) {
        Observable.forkJoin(analyticCallAArray).subscribe(analyticsObjects => {
          let layerIndex: number = 0;
          visualizationObject.layers.forEach(layer => {
            layer.analytics = analyticsObjects[layerIndex];
            layerIndex++;
          });
          observer.next(visualizationObject);
          observer.complete();
        })
      } else {
        observer.next(visualizationObject);
        observer.complete();
      }
    });

  }

  getSanitizedAnalytics(visualizationObject: Visualization): Observable<Visualization> {
    return Observable.create(observer => {
      this.getAnalytic(visualizationObject).subscribe(visualization => {

        if(visualization.details.analyticsStrategy == 'split') {
          visualization = this.getSplitedAnalytics(visualization);
        }

        observer.next(visualization);
        observer.complete();
      })
    })
  }

  getSplitedAnalytics(visualization): Visualization {
    let newSettings: any[] = [];
    let newAnalytics: any[] = [];
    let newLayers: any[] = [];
    visualization.layers.forEach(layer => {
      this.splitFavorite(layer.settings).forEach(settings => {
        newSettings.push(settings);
      });
      if(layer.hasOwnProperty('analytics') && layer.analytics != undefined) {
        this.splitAnalyticsObject(layer.analytics).forEach(analytics => {
          newAnalytics.push(analytics)
        });
      }
    });

    newSettings.forEach((settingsItem,settingsIndex) => {
      newLayers.push({settings: settingsItem, analytics: newAnalytics[settingsIndex]});
    });
    visualization.layers = newLayers;

    return visualization;
  }

  splitFavorite(favorite) {
    let dimensionArray: any = {
      ou: {items: []},
      pe: {items: []},
      dx: {items: []}
    };

    let favoriteArray: any[] = [];

    if(favorite.hasOwnProperty('columns')) {
      favorite.columns.forEach(column => {
        column.items.forEach(item => {
          dimensionArray[column.dimension].type = 'columns';
          dimensionArray[column.dimension].items.push(item);
        });
      })

    }

    if(favorite.hasOwnProperty('rows')) {
      favorite.rows.forEach(row => {
        row.items.forEach(item => {
          dimensionArray[row.dimension].type = 'rows';
          dimensionArray[row.dimension].items.push(item);
        });
      })

    }

    if(favorite.hasOwnProperty('filters')) {
      favorite.filters.forEach(filter => {
        filter.items.forEach(item => {
          dimensionArray[filter.dimension].type = 'filters';
          dimensionArray[filter.dimension].items.push(item);
        });
      })

    }

    favorite.columns = [];
    favorite.rows = [];
    favorite.filters = [];

    /**
     * create favorite copy
     */

    dimensionArray.dx.items.forEach(dxItem => {
      dimensionArray.pe.items.forEach(peItem => {
        let newFavorite = favorite;
        newFavorite[dimensionArray.dx.type] = [{dimension: 'dx', items: dxItem}];
        newFavorite[dimensionArray.pe.type] = [{dimension: 'pe', items: peItem}];
        newFavorite[dimensionArray.ou.type] = [{dimension: 'ou', items: dimensionArray.ou.items}];
        favoriteArray.push(newFavorite);
      })
    });
    return favoriteArray;
  }


  splitAnalyticsObject(analytics: any): Array<any> {

    let analyticsArray: Array<any> = [];
    let headers: any = analytics.headers;
    let rows: Array<any> = analytics.rows;
    let metaData: any = analytics.metaData;
    let names: any = analytics.metaData.names;
    let periods: any = analytics.metaData.pe;
    let data: any = analytics.metaData.dx;
    let ou: any = analytics.metaData.ou;
    let numberOfAnalytics: number = 0;


    let dataIndex: number = 0;
    let valueIndex: number = 0;
    let periodIndex: number = 0;
    let orgUnitIndex: number = 0;

    headers.forEach((header, headerIndex) => {
      if (header.name == "dx") {
        dataIndex = headerIndex;
      }

      if (header.name == "pe") {
        periodIndex = headerIndex;
      }

      if (header.name == "value") {
        valueIndex = headerIndex;
      }

      if (header.name == "ou") {
        orgUnitIndex = headerIndex;
      }

    })
    data.forEach((dataName, dataIndex) => {
      periods.forEach((periodName, periodIndex) => {
        let singleAnalytics: any = {headers: headers, metaData: {names: {}, pe: [], ou: {}, dx: []}, rows: []};
        singleAnalytics.metaData.names[dataName] = names[dataName];
        singleAnalytics.metaData.names[periodName] = names[periodName];
        singleAnalytics.metaData.pe.push(periodName);
        singleAnalytics.metaData.dx.push(dataName);
        singleAnalytics.metaData.ou = ou;

        analyticsArray.push(singleAnalytics);
      });
    });


    analyticsArray.forEach(analytics => {
      let data = analytics.metaData.dx[0];
      let period = analytics.metaData.pe[0];

      rows.forEach(row => {
        if (row[dataIndex] == data) {
          analytics.rows.push(row);
        }
      })
    })


    return analyticsArray;
  }

  constructUrl(visualizationSettings: any, visualizationType: string, filters: any): string {
    let url: string = this.constant.api + "analytics";
    const rowParameters: string = this._getDimensionParameters(visualizationSettings.rows, filters);
    const columnParameters: string = this._getDimensionParameters(visualizationSettings.columns, filters);
    const filterParameters: string = this._getDimensionParameters(visualizationSettings.filters, filters);

    let aggregationType: string = visualizationSettings.hasOwnProperty('aggregationType') ? '&aggregationType=' + visualizationSettings.aggregationType : '';
    let value: string = visualizationSettings.hasOwnProperty('value') ? '&value=' + visualizationSettings.value.id : '';

    if(visualizationType == 'EVENT_CHART') {
      url += "/events/aggregate/" + this._getProgramParameters(visualizationSettings);

    } else if (visualizationType == "EVENT_REPORT") {

      if(visualizationSettings.hasOwnProperty('dataType')) {
        if (visualizationSettings.dataType == "AGGREGATED_VALUES") {
          url += "/events/aggregate/" + this._getProgramParameters(visualizationSettings);
        } else {
          url += "/events/query/" + this._getProgramParameters(visualizationSettings);
        }
      }

    } else if ( visualizationType == "EVENT_MAP") {

      url += "/events/aggregate/" + this._getProgramParameters(visualizationSettings);

    } else if(visualizationType == 'MAP' && visualizationSettings.layer == 'event') {

      url += "/events/query/" + this._getProgramParameters(visualizationSettings);

      /**
       * Also get startDate and end date if available
       */
      if(visualizationSettings.hasOwnProperty('startDate') && visualizationSettings.hasOwnProperty('endDate')) {
        url += 'startDate=' + visualizationSettings.startDate + '&' + 'endDate=' + visualizationSettings.endDate + '&';
      }

    } else {
      url += ".json?";
    }

    /**
     * Add row, column and filter parameters
     * @type {string}
     */
    url += rowParameters != "" ? rowParameters : "";
    url += columnParameters != "" ? '&' + columnParameters : "";
    url += filterParameters != "" ? '&' + filterParameters : "";
    url += value != "" || value != undefined ? value : "";
    url += aggregationType != "" ? aggregationType : "";


    url += this._getAnalyticsCallStrategies(visualizationType, null);
    return url;
  }

  _getDimensionParameters(dimensionArray: any[], filters: any[] = []): string {
    let parameterArray: any = [];
    if(dimensionArray.length > 0) {
      dimensionArray.forEach(dimensionObject => {
        let customDimension = _.filter(filters, ['name', dimensionObject.dimension])[0];

        if(customDimension != undefined) {
          parameterArray.push('dimension=' + customDimension.name + ':' + customDimension.value)
        } else {
          if(dimensionObject.dimension != 'dy') {
            if(dimensionObject.hasOwnProperty('filter')) {
              parameterArray.push('dimension=' + dimensionObject.dimension + ':' + dimensionObject.filter)
            } else {
              let dimensionConnector: string = dimensionObject.items.length > 0 ? ':' : '';
              parameterArray.push('dimension=' + dimensionObject.dimension + dimensionConnector + dimensionObject.items.map(item => {return item.dimensionItem}).join(';'));
            }
          }
        }
      })
    }

    return parameterArray.join('&');
  }

  public getAnalytics(favoriteObject: any, favoriteType: string, customFilter: any[]): Observable<any> {
    return this.http.get(this._constructAnalyticUrl(favoriteObject, favoriteType, customFilter))
      .map((res: Response) => res.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  private _constructAnalyticUrl(favoriteObject: any, favoriteType: string, customFilter: any[]): string {
    let url: string = this.constant.api + "analytics";
    /**
     * Get row, column and filter parameters from object dimension
     * @type {string}
     */
    let rowParameters = this._getDimension('rows', favoriteObject, customFilter);
    let columnParameters = this._getDimension('columns', favoriteObject, customFilter);
    let filterParameters = this._getDimension('filters', favoriteObject, customFilter);

    /**
     * Get url extension based on favorite type
     */
    if (favoriteType == "EVENT_CHART") {
      url += "/events/aggregate/" + this._getProgramParameters(favoriteObject);

    } else if (favoriteType == "EVENT_REPORT") {

      if(favoriteObject.hasOwnProperty('dataType')) {
        if (favoriteObject.dataType == "AGGREGATED_VALUES") {
          url += "/events/aggregate/" + this._getProgramParameters(favoriteObject);
        } else {
          url += "/events/query/" + this._getProgramParameters(favoriteObject);
        }
      } else {
        console.warn('No dataType attribute found for event report');
      }

    } else if ( favoriteType=="EVENT_MAP") {

      url += "/events/aggregate/" + this._getProgramParameters(favoriteObject);

    } else if(favoriteType =='MAP' && favoriteObject.layer == 'event') {

      url += "/events/query/" + this._getProgramParameters(favoriteObject);

      /**
       * Also get startDate and end date if available
       */
      if(favoriteObject.hasOwnProperty('startDate') && favoriteObject.hasOwnProperty('endDate')) {
        url += 'startDate=' + favoriteObject.startDate + '&' + 'endDate=' + favoriteObject.endDate + '&';
      }

    } else {

      url += ".json?";
    }

    /**
     * Add row, column and filter parameters
     * @type {string}
     */
    url += rowParameters != "" ? rowParameters : "";
    url += columnParameters != "" ? '&' + columnParameters : "";
    url += filterParameters != "" ? '&' + filterParameters : "";


    /**
     * Get analytic strategies
     * @type {string}
     */
    url += this._getAnalyticsCallStrategies(favoriteType,favoriteObject.layer);


    return url;
  }

  private _getAnalyticsCallStrategies(visualizationType, layerType: string = null): string {
    let strategies: string = '';

    strategies += visualizationType == "EVENT_CHART" || visualizationType == "EVENT_REPORT"  || visualizationType == "EVENT_MAP" ? "&outputType=EVENT" : "";

    strategies += "&displayProperty=NAME";

    strategies += layerType != null && layerType == 'event' ? "&coordinatesOnly=true" : "";

    return strategies;

  }

  private _getProgramParameters(favoriteObject: any): string {
    let params: string = "";
    if(favoriteObject.hasOwnProperty('program') && favoriteObject.hasOwnProperty('programStage')) {

      if(favoriteObject.program.hasOwnProperty('id') && favoriteObject.programStage.hasOwnProperty('id')) {
        params = favoriteObject.program.id + ".json?stage=" + favoriteObject.programStage.id + "&";
      }
    }
    return params;
  }

  private _getDimension(dimension: string, favoriteObject: any, customFilter: any[]): string {
    let items: string = "";

    if(favoriteObject.hasOwnProperty(dimension)) {

      favoriteObject[dimension].forEach((dimensionValue: any) => {
        items += items != "" ? '&' : "";
        if (dimensionValue.hasOwnProperty('dimension') && dimensionValue.dimension != 'dy') {

          if(dimensionValue.hasOwnProperty('items') && dimensionValue.items.length > 0) {
            items += dimension == 'filters' ? 'filter=' : 'dimension=';
            items += dimensionValue.dimension;
            items += dimensionValue.hasOwnProperty('legendSet') ? '-' + dimensionValue.legendSet.id : "";
            items += ':';
            items += dimensionValue.hasOwnProperty('filter') ? dimensionValue.filter : "";


            if(customFilter.length > 0) {
              items  += this._getCustomDimensionValue(customFilter, dimensionValue.dimension) +  ';';
            } else {
              items += dimensionValue.items.map(item => {return item.hasOwnProperty('dimensionItem') ? item.dimensionItem: ''}).join(';');
            }
          }
        }
      });
    }
    console.log(items)
    return items;
  }

  private _getCustomDimensionValue(customFilter,dimension): string {
    let customValue: any = _.filter(customFilter, ['name', dimension]);
    console.log(customValue)
    return customValue.length > 0 ? customValue[0] : null;
  }

}
