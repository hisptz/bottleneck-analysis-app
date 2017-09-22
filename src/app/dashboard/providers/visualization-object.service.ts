import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Visualization} from '../model/visualization';
import * as _ from 'lodash';
import {AnalyticsService} from './analytics.service';
import {FavoriteService} from './favorite.service';
import {GeoFeatureService} from './geo-feature.service';
import {MapService} from './map.service';
import {getDimensionValues} from '../../store/helpers/visualization.helpers';

@Injectable()
export class VisualizationObjectService {

  constructor(
    private analyticsService: AnalyticsService,
    private favoriteService: FavoriteService,
    private geoFeatureService: GeoFeatureService,
    private mapService: MapService,
  ) {
  }

  loadInitialVisualizationObject(initialDetails: any): Visualization {
    const cardData: any = initialDetails.dashboardItem;
    const favoriteOptions: any[] = initialDetails.favoriteOptions;
    const dashboardId: string = initialDetails.dashboardId;
    const currentUser: any = initialDetails.currentUser;
    return {
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
        loaded: this._getLoadedStatus(cardData),
        hasError: false,
        errorMessage: '',
        appKey: cardData.hasOwnProperty('appKey') ? cardData.appKey : null,
        hideCardBorders: false,
        showCardHeader: true,
        showCardFooter: true,
        showChartOptions: true,
        showFilter: true,
        cardHeight: '490px',
        itemHeight: '465px',
        fullScreen: false,
        type: this._getSanitizedCurrentVisualizationType(cardData.hasOwnProperty('type') ? cardData.type : null),
        currentVisualization: this._getSanitizedCurrentVisualizationType(cardData.hasOwnProperty('type') ? cardData.type : null),
        favorite: this._getFavoriteDetails(cardData, favoriteOptions),
        externalDimensions: {},
        filters: [],
        layouts: [],
        analyticsStrategy: 'normal',
        rowMergingStrategy: 'normal',
        userOrganisationUnit: this._getUserOrganisationUnit(currentUser),
        description: null,
        isNew: initialDetails.isNew
      },
      layers: this._getLayerDetailsForNonVisualizableObject(cardData),
      operatingLayers: []
    };
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
  private _getUserOrganisationUnit(currentUser: any) {
    if (!currentUser.dataVieworganisationUnits) {
      return [];
    }
    return currentUser.dataVieworganisationUnits;
  }

  /**
   * Get initial favorite details
   * @param cardData
   * @returns {{id: undefined, type: boolean}|{}}
   * @private
   */
  private _getFavoriteDetails(cardData, favoriteOptions) {

    const favoriteId = _.isPlainObject(cardData[_.camelCase(cardData.type)]) ? cardData[_.camelCase(cardData.type)].id : undefined;


    return cardData.type !== null && cardData.hasOwnProperty(_.camelCase(cardData.type)) ? {
      id: favoriteId,
      type: _.camelCase(cardData.type),
      options: _.find(favoriteOptions, ['id', favoriteId])
    } : {};
  }

  private _getVisualizationObjectName(cardData) {
    return cardData.type !== null && cardData.hasOwnProperty(_.camelCase(cardData.type)) ? _.isPlainObject(cardData[_.camelCase(cardData.type)]) ? cardData[_.camelCase(cardData.type)].displayName : null : null;
  }

  private _getLoadedStatus(cardData) {
    return cardData.type === 'USERS' || cardData.type === 'REPORTS' ||
      cardData.type === 'RESOURCES' || cardData.type === 'APP' || cardData.type === 'MESSAGES';
  }

  private _getLayerDetailsForNonVisualizableObject(cardData) {
    const layer: any = [];
    if (cardData.type === 'USERS' || cardData.type === 'REPORTS' || cardData.type === 'RESOURCES' || cardData.type === 'APP') {
      layer.push({settings: cardData, analytics: {}});
    }
    return layer;
  }

  mergeVisualizationObject(visualizationObject: Visualization) {
    const newVisualizationObject: Visualization = {...visualizationObject};

    /**
     * Get visualization layers with removed undefined analytics
     */
    const initialVisualizationLayers = _.filter(newVisualizationObject.layers, (layer) => {
      return layer && layer.analytics;
    });

    if (initialVisualizationLayers) {
      const sanitizedVisualizationLayers = _.map(initialVisualizationLayers, (layer) => {
        const newLayer = _.clone(layer);
        if (newLayer.settings.layer) {
          switch (newLayer.settings.layer) {
            case 'event':
              if (newLayer.settings.eventClustering) {
                newLayer.analytics = _.assign(
                  {},
                  this.analyticsService.mapEventClusteredAnalyticsToAggregate(newLayer.analytics)
                );
              }
              break;
            default:
              console.log('default');
              break;
          }
        }
        return newLayer;
      });
      newVisualizationObject.layers = _.assign([], sanitizedVisualizationLayers);
    }
    return newVisualizationObject;
  }

  splitVisualizationObject(visualizationObject: Visualization) {
    const newSplitedLayers: any[] = [];
    const favoriteObjectArray = visualizationObject.layers.map(layer => {
      return layer.settings
    });
    const analyticsObjectArray = visualizationObject.layers.map(layer => {
      return layer.analytics
    });
    let splitedFavorites: any[] = [];
    let splitedAnalytics: any[] = [];

    /**
     * Split analytics
     */
    if (analyticsObjectArray.length === 1) {
      splitedAnalytics = this.analyticsService.splitAnalytics(analyticsObjectArray[0], ['dx', 'pe']);

    }

    /**
     * Split favorite
     */
    if (favoriteObjectArray.length === 1) {
      splitedFavorites = this.favoriteService.splitFavorite(favoriteObjectArray[0], ['dx', 'pe']);

      if (splitedFavorites) {
        splitedFavorites.forEach(favoriteObject => {
          if (splitedAnalytics) {
            splitedAnalytics.forEach(analytics => {
              const dataDimension = analytics.metaData['dx'][0];
              const periodDimension = analytics.metaData['pe'][0];
              const analyticsId = favoriteObject.analyticsIdentifier;
              if (analyticsId === dataDimension + '_' + periodDimension || analyticsId === periodDimension + '_' + dataDimension) {
                newSplitedLayers.push({
                  settings: favoriteObject,
                  analytics: analytics
                })
              }
            })
          }
        })
      }
    }

    visualizationObject.layers = _.assign([], newSplitedLayers);

    return visualizationObject;
  }

  updateVisualizationWithMapSettings(apiRootUrl: string, visualization: Visualization) {
    const visualizationObject: Visualization = {...visualization};
    const dimensionArea = this._findOrgUnitDimension(visualizationObject.details.layout[0].layout);
    return new Observable(observer => {
      visualizationObject.details.mapConfiguration = this.mapService.getMapConfiguration(visualizationObject);
      const geoFeaturePromises = visualizationObject.layers.map((layer: any) => {
        const visualizationFilters = getDimensionValues(layer.settings[dimensionArea], []);
        const orgUnitFilterObject = _.find(visualizationFilters ? visualizationFilters : [], ['name' , 'ou']);
        const orgUnitFilterValue = orgUnitFilterObject ? orgUnitFilterObject.value : '';
        return this.geoFeatureService.getGeoFeature1(apiRootUrl, orgUnitFilterValue);
      });

      Observable.forkJoin(geoFeaturePromises)
        .subscribe((geoFeatureResponse: any[]) => {
          visualizationObject.layers = visualizationObject.layers.map((layer: any, layerIndex: number) => {
            const newLayer = {...layer};
            if (geoFeatureResponse[layerIndex] !== null) {
              newLayer.settings.geoFeature = [...geoFeatureResponse[layerIndex]];
            }
            return newLayer;
          });
          visualizationObject.details.loaded = true;
          observer.next(visualizationObject);
          observer.complete();
        }, (error) => {
          visualizationObject.details.hasError = true;
          visualizationObject.details.errorMessage = error;
          visualizationObject.details.loaded = true;
          observer.next(visualizationObject);
          observer.complete();
        })
    })
  }

  private _findOrgUnitDimension(visualizationLayout: any) {
    let dimensionArea = '';

    if (_.find(visualizationLayout.columns, ['value', 'ou'])) {
      dimensionArea = 'columns';
    } else if (_.find(visualizationLayout.rows, ['value', 'ou'])) {
      dimensionArea = 'rows';
    } else {
      dimensionArea = 'filters'
    }

    return dimensionArea;
  }


}
