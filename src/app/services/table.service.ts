import { Injectable } from '@angular/core';
import {VisualizationStore} from "./visualization-store";
import {AnalyticsService} from "./analytics.service";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Constants} from "./constants";
import {VisualizerService} from "./visualizer.service";
import {Visualization} from "../model/visualization";
import {TableConfiguration} from "../model/table-configuration";

@Injectable()
export class TableService {

  constructor(
    private visualizationStore: VisualizationStore,
    private analyticsService: AnalyticsService,
    private visualizationService: VisualizerService,
    private http: Http,
    private constant: Constants
  ) { }

  public getSanitizedTableData(tableData: Visualization, customFilters): Observable<Visualization> {
    return Observable.create(observer => {
      let tableDataFromStore = this.visualizationStore.find(tableData.id);

      if(tableDataFromStore != null) {
        tableDataFromStore.layers.forEach(layer => {
          if(!layer.settings.hasOwnProperty('tableConfiguration')) {
            layer.settings.tableConfiguration = this.getTableConfiguration(layer.settings, tableDataFromStore.type, {});
          }
        });

        if(customFilters.length > 0) {
          tableDataFromStore.layers.forEach(layer => {
            this.analyticsService.getAnalytics(layer.settings,tableDataFromStore.type,customFilters).subscribe(analyticResult => {
              layer.analytics = analyticResult;

              /**
               * Also update in visualization store
               */
              this.visualizationStore.createOrUpdate(tableDataFromStore);

              /**
               * Return the sanitized data back to chart service
               */
              observer.next(tableDataFromStore);
              observer.complete();

            }, error => {
              console.warn(error);
            })
          })
        } else {
          /**
           * Also update in visualization store
           */
          this.visualizationStore.createOrUpdate(tableDataFromStore);

          /**
           * Return the sanitized data back to chart service
           */
          observer.next(tableDataFromStore);
          observer.complete();

        }


      } else {
        if(tableData.details.hasOwnProperty('favorite')) {
          let favoriteType = tableData.details.favorite.hasOwnProperty('type') ? tableData.details.favorite.type : null;
          let favoriteId = tableData.details.favorite.hasOwnProperty('id') ? tableData.details.favorite.id : null;

          /**
           * Check if favorite has required parameters for favorite call
           */
          if(favoriteType != null && favoriteId != null) {
            this.http.get(this.constant.api + favoriteType + 's/' + favoriteId + '.json?fields=*,dataElementDimensions[dataElement[id,optionSet[id,options[id,name]]]],displayDescription,program[id,name],programStage[id,name],interpretations[*,user[id,displayName],likedBy[id,displayName],comments[lastUpdated,text,user[id,displayName]]],columns[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,legendSet,items[id,dimensionItem,dimensionItemType,displayName]],access,userGroupAccesses,publicAccess,displayDescription,user[displayName,dataViewOrganisationUnits],!href,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!organisationUnitGroups,!itemOrganisationUnitGroups,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits')
              .map((res: Response) => res.json())
              .catch(error => Observable.throw(new Error(error)))
              .subscribe((favoriteResponse:any) => {

                /**
                 * Get table configuration
                 * @type {TableConfiguration}
                 */
                favoriteResponse.tableConfiguration = this.getTableConfiguration(favoriteResponse, tableData.type, {});

                this.analyticsService.getAnalytics(favoriteResponse, tableData.type, customFilters).subscribe(analyticResponse => {

                  /**
                   * Update table data with new information
                   */
                  tableData.layers.push({settings: favoriteResponse, analytics: analyticResponse});

                  /**
                   * Also update operating layers for runtime activities, this will be used for on fly updates
                   */
                  // tableData.operatingLayers.push({settings: favoriteResponse, analytics: analyticResponse});

                  /**
                   * Also save in visualization store
                   */
                  this.visualizationStore.createOrUpdate(tableData);

                  /**
                   * Return the sanitized data back to chart service
                   */
                  observer.next(tableData);
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

  getTableConfiguration(favoriteObject, favoriteType, layout: any): TableConfiguration {

    /**
     * Get columns
     * @type {Array}
     */
    let columns: any[] = [];
    if(layout.hasOwnProperty('columns')) {
      columns = layout.columns;
    } else {
      if (favoriteObject.hasOwnProperty('columns')) {
        favoriteObject.columns.forEach(colValue => {
          if (colValue.dimension != 'dy') {
            columns.push(colValue.dimension);
          }
        });
      }  else {
        columns = ['dx'];
      }
    }


    /**
     * Get rows
     * @type {Array}
     */
    let rows: any[] = [];
    if(layout.hasOwnProperty('rows')) {
      rows = layout.rows;
    } else {
      if (favoriteObject.hasOwnProperty('rows')) {
        favoriteObject.rows.forEach(rowValue => {
          if (rowValue.dimension != 'dy') {
            rows.push(rowValue.dimension)
          }
        })
      } else {
        rows = ['pe'];
      }
    }


    return {
      showColumnTotal: favoriteObject.hasOwnProperty('colTotal') ? favoriteObject.colTotal : true,
      showColumnSubtotal: favoriteObject.hasOwnProperty('colSubtotal') ? favoriteObject.colSubtotal : true,
      showRowTotal: favoriteObject.hasOwnProperty('rowTotal') ? favoriteObject.rowTotal : true,
      showRowSubtotal: favoriteObject.hasOwnProperty('rowSubtotal') ? favoriteObject.rowSubtotal : true,
      showDimensionLabels: favoriteObject.hasOwnProperty('showDimensionLabels') ? favoriteObject.showDimensionLabels : true,
      hideEmptyRows: favoriteObject.hasOwnProperty('hideEmptyRows') ? favoriteObject.hideEmptyRows : true,
      showHierarchy: favoriteObject.hasOwnProperty('showHierarchy') ? favoriteObject.showHierarchy : true,
      displayList: this._checkForEventDataType(favoriteObject,favoriteType),
      rows: rows,
      columns: columns
    }
  }

  private _checkForEventDataType(favoriteObject, favoriteType): boolean {
    let displayList: boolean = false;
    if (favoriteType == 'EVENT_REPORT') {
      if(favoriteObject.hasOwnProperty('dataType') && favoriteObject.dataType == 'EVENTS') {
        displayList = true;
      }
    }
    return displayList;
  }

  public getTableObjects(tableData: Visualization): any[] {
    let tableObjects: any[] = [];
    if(tableData.layers.length > 0) {
      tableData.layers.forEach(layer => {
        if(layer.analytics.hasOwnProperty('headers')) {
          tableObjects.push(this.visualizationService.drawTable(layer.analytics, layer.settings.tableConfiguration));
        } else  {
          console.warn('Analytic object is empty');
        }
      })
    }
    return tableObjects;
  }

}
