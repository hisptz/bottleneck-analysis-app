import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {FavoriteService} from "./favorite.service";
import {Visualization} from "../model/visualization";
import {MapService} from "./map.service";
import {ChartService} from "./chart.service";
import {TableService} from "./table.service";
import * as _ from 'lodash';
import {AnalyticsService} from "./analytics.service";

@Injectable()
export class VisualizationObjectService {

  constructor(
    private favoriteService: FavoriteService,
    private mapService: MapService,
    private chartService: ChartService,
    private tableService: TableService,
    private analyticsService: AnalyticsService
  ) { }

  getSanitizedVisualizationObject(initialVisualization: Visualization): Observable<any> {
    return Observable.create(observer => {
      if(initialVisualization.details.favorite.hasOwnProperty('id')) {
        this.favoriteService.getFavoriteDetails(initialVisualization.details.favorite.type, initialVisualization.details.favorite.id)
          .subscribe(favoriteObject => {
            initialVisualization = this.updateVisualizationConfigurationAndSettings(initialVisualization, favoriteObject);
            this.analyticsService.getAnalytic(initialVisualization).subscribe(visualization => {
              observer.next(visualization);
              observer.complete();
            });
          })
      } else {
      //  TODO use external dimension concept
      }
    });
  }

  private _loadOrUpdateAnalyticsObjects(visualizationObject: Visualization) {

  }

  private _getVisualizationSubtitle(filterArray: any) {
    let subtitleArray: any = {};
    let subtitle: string = '';

    if(filterArray.length > 0) {
      filterArray.forEach(filter => {
        subtitleArray[filter.dimension] = filter.items.map(item => {return item.displayName})
      })
    }

    subtitle += subtitleArray.hasOwnProperty('dx') ? subtitleArray.dx.join(',') : '';
    subtitle += subtitleArray.hasOwnProperty('pe') ? subtitle != '' ? ' - ' + subtitleArray.pe.join(',') : '' + subtitleArray.pe.join(',') : '';
    subtitle += subtitleArray.hasOwnProperty('ou') ? subtitle != '' ? ' - ' + subtitleArray.ou.join(',') : '' + subtitleArray.ou.join(',') : '';

    return subtitle;
  }

  public updateVisualizationConfigurationAndSettings(visualizationObject: Visualization, favoriteObject: any) {

    /**
     * Get visualization object name if any
     */
    if(visualizationObject.layers.length == 0) {
        visualizationObject.name = favoriteObject.hasOwnProperty('displayName') ? favoriteObject.displayName : favoriteObject.hasOwnProperty('name') ? favoriteObject.name : null;
    }

    if (visualizationObject.details.currentVisualization == 'MAP') {

        if(!visualizationObject.details.hasOwnProperty('mapConfiguration')) {
          visualizationObject.details.mapConfiguration = this.mapService.getMapConfiguration(favoriteObject);
        }

        if(visualizationObject.layers.length == 0) {
          if(favoriteObject.hasOwnProperty('mapViews') && favoriteObject.mapViews.length > 0) {
            favoriteObject.mapViews.forEach((view: any) => {

              if(view.hasOwnProperty('filters') && view.filters.length > 0) {
                view.subititle = this._getVisualizationSubtitle(view.filters)
              }

              visualizationObject.layers.push({settings: view, analytics: {}})
            })
          }
        }


      } else if (visualizationObject.details.currentVisualization == 'CHART') {

          if(visualizationObject.layers.length == 0) {
            let settings: any = favoriteObject;

            /**
             * Get chart subtitle
             */
            if(favoriteObject.hasOwnProperty('filters') && favoriteObject.filters.length > 0) {
              settings.subititle = this._getVisualizationSubtitle(favoriteObject.filters)
            }

            /**
             * get chart configuration
             * @type {ChartConfiguration}
             */
            settings.chartConfiguration = this.chartService.getChartConfiguration(favoriteObject);


            visualizationObject.layers.push({settings: settings, analytics: {}})

          } else {
            visualizationObject.layers.forEach(layer => {
              if(!layer.settings.hasOwnProperty('chartConfiguration')) {
                layer.settings.chartConfiguration = this.chartService.getChartConfiguration(layer.settings);
              }
            })
          }

      } else if (visualizationObject.details.currentVisualization == 'TABLE') {

        if(visualizationObject.layers.length == 0) {

          let settings: any = favoriteObject;

          if(favoriteObject.hasOwnProperty('filters') && favoriteObject.filters.length > 0) {
            settings.subititle = this._getVisualizationSubtitle(favoriteObject.filters)
          }
          settings.tableConfiguration = this.tableService.getTableConfiguration(favoriteObject, visualizationObject.type, visualizationObject.details.layout);
          visualizationObject.layers.push({settings: settings, analytics: {}})

        } else {

          visualizationObject.layers.forEach(layer => {
            if(!layer.settings.hasOwnProperty('tableConfiguration')) {
              layer.settings.tableConfiguration = this.tableService.getTableConfiguration(layer.settings, visualizationObject.type, visualizationObject.details.layout);
            }
          });

        }

      }

      return visualizationObject
  }

}
