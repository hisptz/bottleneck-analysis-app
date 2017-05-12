import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Constants} from "./constants";
import * as _ from 'lodash';

@Injectable()
export class AnalyticsService {

  constructor(
    private constant: Constants,
    private http: Http
  ) { }

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

    strategies += "&displayProperty=NAME" + visualizationType == "EVENT_CHART" ? "&outputType=EVENT&" : visualizationType == "EVENT_REPORT" ? "&outputType=EVENT&displayProperty=NAME" : visualizationType == "EVENT_MAP" ? "&outputType=EVENT&displayProperty=NAME" : "&displayProperty=NAME";

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
