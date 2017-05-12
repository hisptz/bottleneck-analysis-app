import { Injectable } from '@angular/core';
import {VisualizationStore} from "./visualization-store";
import {AnalyticsService} from "./analytics.service";
import {VisualizerService} from "./visualizer.service";
import {Http, Response} from "@angular/http";
import {Constants} from "./constants";
import {Visualization} from "../model/visualization";
import {Observable} from "rxjs";
import {ChartConfiguration} from "../model/chart-configuration";


@Injectable()
export class ChartService {

  constructor(
    private visualizationStore: VisualizationStore,
    private analyticsService: AnalyticsService,
    private visualizationService: VisualizerService,
    private http: Http,
    private constant: Constants
  ) { }

  /**
   * Get sanitized chart data
   * @param chartData
   * @returns {any}
   */
  public getSanitizedChartData(chartData: Visualization, customFilters): Observable<Visualization> {
    return Observable.create(observer => {
      let chartDataFromStore = this.visualizationStore.find(chartData.id);
      if(chartDataFromStore != null) {

          if(chartDataFromStore.type != 'CHART') {
            chartDataFromStore.layers.forEach(layer => {
              if(!layer.settings.hasOwnProperty('chartConfiguration')) {
                layer.settings.chartConfiguration = this.getChartConfiguration(layer.settings);
              }
            });
          }

          if(customFilters.length > 0) {
            chartDataFromStore.layers.forEach(layer => {
              this.analyticsService.getAnalytics(layer.settings,chartDataFromStore.type,customFilters).subscribe(analyticResult => {
                layer.analytics = analyticResult;

                /**
                 * Also update in visualization store
                 */
                this.visualizationStore.createOrUpdate(chartDataFromStore);

                /**
                 * Return the sanitized data back to chart service
                 */
                observer.next(chartDataFromStore);
                observer.complete();
              }, error => {
                console.warn(error);
              })
            })
          } else {
            /**
             * Also update in visualization store
             */
            this.visualizationStore.createOrUpdate(chartDataFromStore);

            /**
             * Return the sanitized data back to chart service
             */
            observer.next(chartDataFromStore);
            observer.complete();
          }


      } else {
        if(chartData.details.hasOwnProperty('favorite')) {
          let favoriteType = chartData.details.favorite.hasOwnProperty('type') ? chartData.details.favorite.type : null;
          let favoriteId = chartData.details.favorite.hasOwnProperty('id') ? chartData.details.favorite.id : null;

          /**
           * Check if favorite has required parameters for favorite call
           */
          if(favoriteType != null && favoriteId != null) {
            console.log(favoriteId)
            this.http.get(this.constant.api + favoriteType + 's/' + favoriteId + '.json?fields=*,dataElementDimensions[dataElement[id,optionSet[id,options[id,name]]]],displayDescription,program[id,name],programStage[id,name],interpretations[*,user[id,displayName],likedBy[id,displayName],comments[lastUpdated,text,user[id,displayName]]],columns[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,dataViewOrganisationUnits],!href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits')
              .map((res: Response) => res.json())
              .catch(error => Observable.throw(new Error(error)))
              .subscribe((favoriteResponse: any) => {

                /**
                 * Get chart configuration
                 * @type {ChartConfiguration}
                 */
                favoriteResponse.chartConfiguration = this.getChartConfiguration(favoriteResponse);

                this.analyticsService.getAnalytics(favoriteResponse, chartData.type,customFilters).subscribe(analyticResponse => {

                  /**
                   * Update chart data with new information
                   */
                  chartData.layers.push({settings: favoriteResponse, analytics: analyticResponse});

                  /**
                   * Also update operating layers for runtime activities, this will be used for on fly updates
                   */
                  // chartData.operatingLayers.push({settings: favoriteResponse, analytics: analyticResponse});

                  /**
                   * Also save in visualization store
                   */
                  // this.visualizationStore.createOrUpdate(chartData);

                  /**
                   * Return the sanitized data back to chart service
                   */
                  observer.next(chartData);
                  observer.complete();

                }, analyticsError => {
                  observer.error(analyticsError);
                })

              }, favoriteError => {
                observer.error(favoriteError)
              })
          } else {
            observer.error('Favorite essential parameters are not supplied');
          }
        } else {
          observer.error('There is no favorite reference on this object');
        }
      }
    })
  }

  /**
   *
   * @param chartData
   * @returns {any[]}
   */
  public getChartObjects(chartData: Visualization, chartType: string = null): any[] {
    let chartObjects: any[] = [];
    if(chartData.layers.length > 0) {
      chartData.layers.forEach(layer => {
        /**
         * Include custom chart type if any
         */
        if(chartType != null) {
          layer.settings.chartConfiguration.type = chartType;
        }

        if(layer.analytics.hasOwnProperty('headers')) {
          chartObjects.push(this.visualizationService.drawChart(layer.analytics, layer.settings.chartConfiguration))
        } else {
          console.warn('Analytic object is empty')
        }
      })
    }
    return chartObjects;
  }

  /**
   * Get chart settings
   * @returns {ChartConfiguration}
   */
  getChartConfiguration(favoriteObject: any): ChartConfiguration {
    return {
      type: favoriteObject.hasOwnProperty('type') ? favoriteObject.type.toLowerCase() : 'bar',
      title: favoriteObject.hasOwnProperty('displayName') ? favoriteObject.displayName : "",
      subtitle: "MOWI",
      hideTitle: favoriteObject.hasOwnProperty('hideTitle') ? favoriteObject.hideTitle : true,
      hideSubtitle: favoriteObject.hasOwnProperty('hideSubtitle') ? favoriteObject.hideSubtitle : true,
      showData: favoriteObject.hasOwnProperty('showData') ? favoriteObject.showData : true,
      hideEmptyRows: favoriteObject.hasOwnProperty('hideEmptyRows') ? favoriteObject.hideEmptyRows : true,
      xAxisType: this._getAxisType('xAxisType', favoriteObject),
      yAxisType: this._getAxisType('yAxisType', favoriteObject),
    };
  }

  private _getAxisType(axis, favoriteObject) {
    let axisType: string = '';
    if(axis == 'xAxisType') {
      if(favoriteObject.hasOwnProperty('category')) {
        axisType = favoriteObject.category;
      } else if(favoriteObject.hasOwnProperty('rows') && favoriteObject.rows.length > 0) {
        axisType = favoriteObject.rows[0].dimension;
      } else {
        axisType = 'dx'
      }
    } else {
      if(favoriteObject.hasOwnProperty('series')) {
        axisType = favoriteObject.series;
      } else if(favoriteObject.hasOwnProperty('columns') && favoriteObject.columns.length > 0) {
        axisType = favoriteObject.columns[0].dimension;
      } else {
        axisType = 'ou'
      }
    }
    return axisType;
  }

}
