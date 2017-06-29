import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Visualization} from '../model/visualization';
import * as _ from 'lodash';

@Injectable()
export class VisualizationObjectService {

  constructor() { }

  loadInitialVisualizationObject(initialDetails: any): Observable<any> {
    const cardData: any = initialDetails.dashboardItem;
    const dashboardId: string = initialDetails.dashboardId;
    const currentUser: any = initialDetails.currentUser;
    return Observable.create(observer => {
      const visualizationObject: Visualization = {
        id: cardData.hasOwnProperty('id') ? cardData.id : null,
        name: this._getVisualizationObjectName(cardData),
        type: cardData.hasOwnProperty('type') ? cardData.type : null,
        created: cardData.hasOwnProperty('created') ? cardData.created : null,
        lastUpdated: cardData.hasOwnProperty('lastUpdated') ? cardData.lastUpdated : null,
        shape: cardData.hasOwnProperty('shape') ? cardData.shape : 'NORMAL',
        dashboardId: dashboardId,
        subtitle: null,
        description: null,
        details: {
          loaded: false,
          hasError: false,
          errorMessage: '',
          appKey: cardData.hasOwnProperty('appKey') ? cardData.appKey : null,
          hideCardBorders: false,
          showCardHeader: true,
          showCardFooter: true,
          showChartOptions: true,
          fullScreen: false,
          type: this._getSanitizedCurrentVisualizationType(cardData.hasOwnProperty('type') ? cardData.type : null),
          currentVisualization: this._getSanitizedCurrentVisualizationType(cardData.hasOwnProperty('type') ? cardData.type : null),
          favorite: this._getFavoriteDetails(cardData),
          externalDimensions: {},
          filters: [],
          layouts: [],
          analyticsStrategy: 'normal',
          rowMergingStrategy: 'normal',
          userOrganisationUnit: this._getUserOrganisationUnit(currentUser),
          description: null
        },
        layers: this._getLayerDetailsForNonVisualizableObject(cardData),
        operatingLayers: []
      }
      observer.next({apiRootUrl: initialDetails.apiRootUrl, visualizationObject: visualizationObject});
      observer.complete();
    });
  }

  /**
   * Get sanitized type
   * @param visualizationType
   * @returns {string}
   * @private
   */
  private _getSanitizedCurrentVisualizationType(visualizationType: string): string {
    let sanitizedVisualization: string = null;

    if (visualizationType === 'CHART' || visualizationType === 'EVENT_CHART') {
      sanitizedVisualization = 'CHART';
    } else if (visualizationType === 'TABLE' || visualizationType === 'EVENT_REPORT' || visualizationType === 'REPORT_TABLE') {
      sanitizedVisualization = 'TABLE';
    } else if (visualizationType === 'MAP') {
      sanitizedVisualization = 'MAP';
    } else {
      sanitizedVisualization = visualizationType;
    }
    return sanitizedVisualization
  }

  /**
   * Get current user oragnisation unit
   * @param currentUser
   * @returns {null}
   * @private
   */
  private _getUserOrganisationUnit(currentUser) {
    if (!currentUser.dataViewOrganisationUnits) {
      return null;
    }
    const orderedOrgUnits = _.orderBy(currentUser.dataViewOrganisationUnits, ['level'], ['asc']);
    return orderedOrgUnits.length > 0 ? orderedOrgUnits[0].name : null;
  }

  /**
   * Get initial favorite details
   * @param cardData
   * @returns {{id: undefined, type: boolean}|{}}
   * @private
   */
  private _getFavoriteDetails(cardData) {
    return cardData.type !== null && cardData.hasOwnProperty(_.camelCase(cardData.type)) ? {
      id: _.isPlainObject(cardData[_.camelCase(cardData.type)]) ? cardData[_.camelCase(cardData.type)].id : undefined,
      type: _.camelCase(cardData.type)
    } : {};
  }

  private _getVisualizationObjectName(cardData) {
    return cardData.type !== null && cardData.hasOwnProperty(_.camelCase(cardData.type)) ? _.isPlainObject(cardData[_.camelCase(cardData.type)]) ? cardData[_.camelCase(cardData.type)].displayName : null : null;
  }

  private _getLayerDetailsForNonVisualizableObject(cardData) {
    const layer: any = [];
    if (cardData.type === 'USERS' || cardData.type === 'REPORTS' || cardData.type === 'RESOURCES' || cardData.type === 'APP') {
      layer.push({settings: cardData, analytics: {}});
    }
    return layer;
  }

}
