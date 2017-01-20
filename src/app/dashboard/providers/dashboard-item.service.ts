import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable, BehaviorSubject} from "rxjs"
import {DashboardItem} from "../interfaces/dashboard-item";
import {UtilitiesService} from "./utilities.service";


@Injectable()
export class DashboardItemService {

  public dashboardItems: Observable<DashboardItem[]>;
  private _dashboardItemsPool: BehaviorSubject<DashboardItem[]>;
  private baseUrl: string;
  private dataStore: {
    dashboardItems: DashboardItem[]
  };

  constructor(
      private http: Http,
      private utilService: UtilitiesService
  ) {
    this.baseUrl = '/api/dashboards';
    this.dataStore = {dashboardItems: []};
    this._dashboardItemsPool = <BehaviorSubject<DashboardItem[]>> new BehaviorSubject([]);
    this.dashboardItems = this._dashboardItemsPool;
  }

  //Methods
  all(): Observable<DashboardItem[]> {
    return Observable.create(observer => {
      this.dashboardItems.subscribe(pool => {
        if(Object.keys(pool).map(key => pool[key]).length > 0) {
          observer.next(Object.keys(pool).map(key => pool[key]));
          observer.complete();
        } else {
          this._loadAll().subscribe(data => {
            observer.next(Object.keys(data).map(key => data[key]));
            observer.complete();
          })
        }
      });
    });
  }

  private _loadAll(): Observable<any> {
    return Observable.create(observer => {
      this.http.get(this.baseUrl +  '.json?fields=id,dashboardItems[:all,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],resources[id,displayName],users[id,displayName]]').map(res => res.json()).subscribe(response => {
        let dashboardItemData = [];
        response.dashboards.forEach((dataValue, dataIndex) => {
          dashboardItemData[dataValue.id] = dataValue.dashboardItems;
        });
        this.dataStore.dashboardItems = dashboardItemData;
        //persist dashboardItems into the pool
        this._dashboardItemsPool.next(Object.assign({}, this.dataStore).dashboardItems);
        observer.next(this._dashboardItemsPool);
        observer.complete();
      })
    })
  }


  findByDashboard(dashboardId: string): Observable<DashboardItem> {
    return Observable.create(observer => {
      this.dashboardItems.subscribe(dashboardItemData => {
        if(dashboardItemData[dashboardId]) {
          observer.next(dashboardItemData[dashboardId]);
          observer.complete();
        } else {
          //load from source if pool has no data
          this._loadAll().subscribe(dashboardItemData => {
            if(dashboardItemData[dashboardId]) {
              observer.next(dashboardItemData[dashboardId]);
              observer.complete();
            } else {
              observer.next('DashboardItem with id "'+ dashboardId + '" could not be found or may have been deleted');
              observer.complete();
            }
          });
        }
      });
    });
  }

  // create(dashboardItemData: DashboardItem): Observable<string> {
  //   return Observable.create(observer => {
  //     this.http.post(this.baseUrl, dashboardItemData)
  //         .map(response => {
  //           //@todo find best way to pre-retrieve dashboardItem id after creation
  //           let dashboardItemid: string = null;
  //           response.headers.forEach((headerItem, headerIndex) => {
  //             if(headerIndex == 'location') {
  //               dashboardItemid = headerItem[0].split("/")[2];
  //             }
  //           });
  //           return {id: dashboardItemid, name:dashboardItemData.name};
  //         }).subscribe(response => {
  //       //@todo find best way to declare variable of type dashboardItem
  //       let data: any = {};
  //       data[response.id] = response;
  //       this.dataStore.dashboardItems.push(data);
  //       this._dashboardItemsPool.next(Object.assign({}, this.dataStore).dashboardItems);
  //       observer.next(response.id);
  //       observer.complete();
  //     }, error => {
  //       observer.error(error);
  //     });
  //   })
  // }

  // update(dashboardItemData: any) {
  //   let dashboardItemid = dashboardItemData.id;
  //   this.http.put(this.baseUrl + '/'+ dashboardItemid, {name: dashboardItemData.name})
  //       .map(response => response.json())
  //       .subscribe(success => {
  //         //update the dashboardItemPool also
  //         this.dataStore.dashboardItems[dashboardItemid] = dashboardItemData;
  //         this._dashboardItemsPool.next(Object.assign({}, this.dataStore).dashboardItems);
  //       }, error => console.log('Could not update dashboard.'));
  // }

  updateShape(dashboardItemId, dashboardId, shape): void {

    //update dashboard item pool
    this.findByDashboard(dashboardId).subscribe(dashboardItems => {
      let items = Object.keys(dashboardItems).map(key => dashboardItems[key]);
      items.forEach((itemValue, itemIndex) => {
        if(itemValue.id == dashboardItemId) {
          itemValue.shape = shape;
        }
      });
    });
    //update permanently to the source
    //@todo find best way to show success for no body request
    this.http.put('/api/dashboardItems/' + dashboardItemId + '/shape/' + shape, '').map(res => res.json())
        .subscribe(response => {

        }, error => {

        })
  }

  // delete(dashboardItemId: string) {
  //   this.http.delete(this.baseUrl + '/' + dashboardItemId)
  //       .subscribe(response => {
  //         //refresh dashboardItem pool
  //         this._loadAll().subscribe(dashboardItemData => {
  //           console.log('refreshed');
  //         })
  //       }, error => console.log('error deleting dashboardItem'))
  // }

    /**
     *
      * @param dashboardItem
     * @returns {any}
     */
  getDashboardItemObject(dashboardItem: any): Observable<any> {
      return Observable.create(observer => {
          this.http.get("/api/"+this.utilService.formatEnumString(dashboardItem.type)+"s/"+dashboardItem[this.utilService.formatEnumString(dashboardItem.type)].id+".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]").map(res => res.json()).subscribe(object => {
              observer.next(object);
              observer.complete()
          }, error => {
              observer.next(error);
              observer.complete();
          });
      });
  }

    /**
     *
     * @param dashBoardObject
     * @returns {string}
     */
  getDashBoardItemAnalyticsUrl(dashBoardObject): string {
        let url = "/api/analytics";
        let column = "";
        let row = "";
        let filter = "";
        //checking for columns
        dashBoardObject.columns.forEach((dashBoardObjectColumn : any,index : any)=>{
            let items = "";
            if(dashBoardObjectColumn.dimension!="dy"){
                (index == 0)? items = "dimension="+dashBoardObjectColumn.dimension+":": items += "&dimension="+dashBoardObjectColumn.dimension+":";
                dashBoardObjectColumn.items.forEach((dashBoardObjectColumnItem : any)=>{
                    items += dashBoardObjectColumnItem.id + ";"
                });
                if(dashBoardObjectColumn.filter) {
                    items += dashBoardObjectColumn.filter+';';
                }
                column += items.slice(0, -1);
            }
        });
        //checking for rows
        dashBoardObject.rows.forEach((dashBoardObjectRow : any)=>{
            let items = "";
            if(dashBoardObjectRow.dimension!="dy"){
                items += "&dimension="+dashBoardObjectRow.dimension+":";
                dashBoardObjectRow.items.forEach((dashBoardObjectRowItem : any)=>{
                    items += dashBoardObjectRowItem.id + ";"
                });
                if(dashBoardObjectRow.filter) {
                    items += dashBoardObjectRow.filter+';';
                }
                row += items.slice(0, -1);
            }
        });
        //checking for filters
        dashBoardObject.filters.forEach((dashBoardObjectFilter : any)=>{
            let items = "";
            if(dashBoardObjectFilter.dimension!="dy"){
                items += "&dimension="+dashBoardObjectFilter.dimension+":";
                dashBoardObjectFilter.items.forEach((dashBoardObjectFilterItem : any)=>{
                    items += dashBoardObjectFilterItem.id + ";"
                });
                if(dashBoardObjectFilter.filter) {
                    items += dashBoardObjectFilter.filter+';';
                }
                filter += items.slice(0, -1);
            }
        });

        //set url base on type
        if( dashBoardObject.type=="EVENT_CHART" ) {
            url += "/events/aggregate/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
        }else if ( dashBoardObject.type=="EVENT_REPORT" ) {
            if( dashBoardObject.dataType=="AGGREGATED_VALUES") {
                url += "/events/aggregate/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
            }else {
                url += "/events/query/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
            }

        }else if ( dashBoardObject.type=="EVENT_MAP" ) {
            url +="/events/aggregate/"+dashBoardObject.program.id+".json?stage="  +dashBoardObject.programStage.id+"&";
        }else {
            url += ".json?";
        }

        url += column+row;
        ( filter == "" )? url+"" : url += filter;
        url += "&displayProperty=NAME"+  dashBoardObject.type=="EVENT_CHART" ?
            "&outputType=EVENT&"
            : dashBoardObject.type=="EVENT_REPORT" ?
            "&outputType=EVENT&displayProperty=NAME"
            : dashBoardObject.type=="EVENT_MAP" ?
            "&outputType=EVENT&displayProperty=NAME"
            :"&displayProperty=NAME" ;
        return url;
    }

    /**
     *
     * @param analyticUrl
     * @returns {any}
     */
    getDashboardItemAnalyticsObject(analyticUrl: string): Observable<any> {
        return Observable.create(observer => {
            this.http.get(analyticUrl).map(res =>res.json())
                .subscribe(analyticsData => {
                    observer.next(analyticsData);
                    observer.complete();
                }, error => {
                    observer.error(error);
                    observer.complete();
                })
        })
    }

    getDashboardItemMetadataIdentifiers(dashboardObject: any): string {
      let items = "";
      dashboardObject.rows.forEach((dashBoardObjectRow : any)=>{
        if(dashBoardObjectRow.dimension === "dx"){
          dashBoardObjectRow.items.forEach((dashBoardObjectRowItem : any)=>{
            items += dashBoardObjectRowItem.id + ";"
          });
        } else {
          //find identifiers in the column if not in row
          dashboardObject.columns.forEach((dashBoardObjectColumn : any) => {
            if(dashBoardObjectColumn.dimension === "dx") {
              dashBoardObjectColumn.items.forEach((dashBoardObjectColumnItem: any)=> {
                items += dashBoardObjectColumnItem.id + ";"
              });
            }
          });
        }
      });
      return items.slice(0, -1);
    }
}
