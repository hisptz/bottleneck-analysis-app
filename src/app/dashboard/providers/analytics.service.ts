import { Injectable } from '@angular/core';
import {HttpClientService} from '../../providers/http-client.service';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';

@Injectable()
export class AnalyticsService {

  constructor(
    private http: HttpClientService
  ) { }

  getAnalytics(visualizationDetails: any) {
    return Observable.create(observer => {
      Observable.forkJoin(visualizationDetails.filters.map(filterObject => {
        let analyticUrl = '';
        if (filterObject.filters.filter(filterValue => { return filterValue.value === ''}).length === 0) {
          const parameters: string = filterObject.filters.map(filter => {
            return filter.value !== '' ? 'dimension=' + filter.name + ':' + filter.value : 'dimension=' + filter.name
          }).join('&');
          if (parameters !== '') {
            let visualizationSetting = this._getVisualizationSettings(visualizationDetails.favorite, filterObject.id);
            if (visualizationSetting == null) {
              visualizationSetting = visualizationDetails.visualizationObject.layers.map(layer => { return layer.settings}).filter(setting => { return setting.id === filterObject.id})[0];
            }
            analyticUrl = this._constructAnalyticsUrl(
              visualizationDetails.apiRootUrl,
              visualizationDetails.visualizationObject.type,
              visualizationSetting,
              parameters
            )
          }
        }
        return analyticUrl !== '' ? this.http.get(analyticUrl) : Observable.of(null)
      })).subscribe(analyticsResponse => {
        visualizationDetails.analytics = analyticsResponse.filter(analytics => {return analytics !== null});
        observer.next(visualizationDetails);
        observer.complete();
      }, error => observer.error(error))
    });
  }

  private _getVisualizationSettings(favoriteObject, settingsId) {
    let settings: any = null;
    if (favoriteObject) {
      if (favoriteObject.mapViews) {
        settings = _.find(favoriteObject.mapViews, ['id', settingsId])
      } else if (favoriteObject.id === settingsId) {
        settings = favoriteObject
      }
    }
    return settings;
  }

  private _constructAnalyticsUrl(
    apiRootUrl: string,
    visualizationType: string,
    visualizationSettings: any,
    parameters: any
  ) {
    let url: string = apiRootUrl + 'analytics';
    const aggregationType: string = visualizationSettings.hasOwnProperty('aggregationType') ? '&aggregationType=' + visualizationSettings.aggregationType : '';
    const value: string = visualizationSettings.hasOwnProperty('value') ? '&value=' + visualizationSettings.value.id : '';

    if (visualizationType === 'EVENT_CHART') {
      url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);

    } else if (visualizationType === 'EVENT_REPORT') {

      if (visualizationSettings.hasOwnProperty('dataType')) {
        if (visualizationSettings.dataType === 'AGGREGATED_VALUES') {
          url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);
        } else {
          url += '/events/query/' + this._getProgramParameters(visualizationSettings);
        }
      }

    } else if (visualizationType === 'EVENT_MAP') {

      url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);

    } else if (visualizationType === 'MAP' && visualizationSettings.layer === 'event') {

      if (visualizationSettings.aggregate) {
        url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);
      } else {
        url += '/events/query/' + this._getProgramParameters(visualizationSettings);
      }

      /**
       * Also get startDate and end date if available
       */
      if (visualizationSettings.hasOwnProperty('startDate') && visualizationSettings.hasOwnProperty('endDate')) {
        url += 'startDate=' + visualizationSettings.startDate + '&' + 'endDate=' + visualizationSettings.endDate + '&';
      }

    } else {
      url += '.json?';
    }

    if (parameters !== '') {
      url += parameters;
    }
    url += value !== '' || value !== undefined ? value : '';
    url += aggregationType !== '' ? aggregationType : '';

    url += this._getAnalyticsCallStrategies(visualizationType, null);
    return url;
  }

  private _constructUrl(visualizationSettings: any, visualizationType: string, filters: any): string {
    let url: string = '../../../api/25/' + 'analytics';
    const rowParameters: string = this._getDimension('rows', visualizationSettings, filters);
    const columnParameters: string = this._getDimension('columns', visualizationSettings, filters);
    const filterParameters: string = this._getDimension('filters', visualizationSettings, filters);

    const aggregationType: string = visualizationSettings.hasOwnProperty('aggregationType') ? '&aggregationType=' + visualizationSettings.aggregationType : '';
    const value: string = visualizationSettings.hasOwnProperty('value') ? '&value=' + visualizationSettings.value.id : '';

    if (visualizationType === 'EVENT_CHART') {
      url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);

    } else if (visualizationType === 'EVENT_REPORT') {

      if (visualizationSettings.hasOwnProperty('dataType')) {
        if (visualizationSettings.dataType === 'AGGREGATED_VALUES') {
          url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);
        } else {
          url += '/events/query/' + this._getProgramParameters(visualizationSettings);
        }
      }

    } else if (visualizationType === 'EVENT_MAP') {

      url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);

    } else if (visualizationType === 'MAP' && visualizationSettings.layer === 'event') {

      if (visualizationSettings.aggregate) {
        url += '/events/aggregate/' + this._getProgramParameters(visualizationSettings);
      } else {
        url += '/events/query/' + this._getProgramParameters(visualizationSettings);
      }

      /**
       * Also get startDate and end date if available
       */
      if (visualizationSettings.hasOwnProperty('startDate') && visualizationSettings.hasOwnProperty('endDate')) {
        url += 'startDate=' + visualizationSettings.startDate + '&' + 'endDate=' + visualizationSettings.endDate + '&';
      }

    } else {
      url += '.json?';
    }

    /**
     * Add row, column and filter parameters
     * @type {string}
     */
    url += rowParameters !== '' ? rowParameters : '';
    url += columnParameters !== '' ? '&' + columnParameters : '';
    url += filterParameters !== '' ? '&' + filterParameters : '';
    url += value !== '' || value !== undefined ? value : '';
    url += aggregationType !== '' ? aggregationType : '';


    url += this._getAnalyticsCallStrategies(visualizationType, null);
    return url;
  }

  private _getAnalyticsCallStrategies(visualizationType, layerType: string = null): string {
    let strategies = '';
    strategies += visualizationType === 'EVENT_CHART' || visualizationType === 'EVENT_REPORT' || visualizationType === 'EVENT_MAP' ? '&outputType=EVENT' : '';
    strategies += '&displayProperty=NAME';
    strategies += layerType !== null && layerType === 'event' ? '&coordinatesOnly=true' : '';
    return strategies;
  }

  private _getProgramParameters(favoriteObject: any): string {
    let params = '';
    if (favoriteObject.hasOwnProperty('program') && favoriteObject.hasOwnProperty('programStage')) {

      if (favoriteObject.program.hasOwnProperty('id') && favoriteObject.programStage.hasOwnProperty('id')) {
        params = favoriteObject.program.id + '.json?stage=' + favoriteObject.programStage.id + '&';
      }
    }
    return params;
  }

  private _getDimension(dimension: string, favoriteObject: any, filters: any[]): string {
    let items = '';
    if (favoriteObject.hasOwnProperty(dimension)) {

      favoriteObject[dimension].forEach((dimensionValue: any) => {
        items += items !== '' ? '&' : '';
        if (dimensionValue.hasOwnProperty('dimension') && dimensionValue.dimension !== 'dy') {
          const customDimension: any = _.find(filters, ['name', dimensionValue.dimension]);
          if (dimensionValue.hasOwnProperty('items')) {
            items += 'dimension=';
            items += dimensionValue.dimension;
            items += dimensionValue.hasOwnProperty('legendSet') ? '-' + dimensionValue.legendSet.id : '';
            items += ':';
            items += dimensionValue.hasOwnProperty('filter') ? dimensionValue.filter : '';


            if (customDimension) {
              items += customDimension.value;
            } else {
              const dimensionItems: any[] = _.clone(dimensionValue.items);
              items += dimensionItems.map(item => {
                return item.hasOwnProperty('dimensionItem') ? item.dimensionItem : ''
              }).join(';');
            }
          }
        }
      });
    }
    return items;
  }


}
