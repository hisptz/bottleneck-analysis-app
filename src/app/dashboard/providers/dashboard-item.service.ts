import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable, BehaviorSubject} from "rxjs"
import {DashboardItem} from "../interfaces/dashboard-item";
import {UtilitiesService} from "./utilities.service";
import {Constants} from "../../shared/constants";
import {isNull} from "util";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {isUndefined} from "util";
import {DashboardService} from "./dashboard.service";


@Injectable()
export class DashboardItemService {
  dashboardItems: Array<any>;
  dashboardAnalyticObjects: Array<any>;
  private _url: string;
  private url: string;
  constructor(
    private http: Http,
    private utilService: UtilitiesService,
    private constant: Constants,
    private dashboardService: DashboardService
  ) {
    this._url = this.constant.root_url + 'api/dashboards';
    this.url = this.constant.root_url + 'api/dashboardItems';
    this.dashboardItems = [];
    this.dashboardAnalyticObjects = [];
  }

  find(id: string, type?: string): any {
    console.log(type)
    return Observable.create(observer => {
      let dashboardItem = this.dashboardItems.filter((item) => {return item.id == id ? item : null;})[0];
      if(isUndefined(dashboardItem)) {
        this.http.get(this.url + '/' + id + '.json?fields=:all,' + this.utilService.camelCaseName(type) + '[id,name,type,series,category]')
          .map(res => res.json())
          .catch(this.utilService.handleError)
          .subscribe(
            dashboardItem => {
              //update the pool
              this.dashboardItems.push(dashboardItem);
              observer.next(dashboardItem);
              observer.complete()
            }, error => {
              observer.error(error)
            })
      } else {
        observer.next(dashboardItem);
        observer.complete()
      }
    })
  }

  updateShape(dashboardItemId, shape): void {
    //update dashboard item pool
    this.find(dashboardItemId).subscribe(
      dashboardItem => {
        dashboardItem.shape = shape;
      });
    //update permanently to the source
    //@todo find best way to show success for no body request
    this.http.put(this.constant.root_url + 'api/dashboardItems/' + dashboardItemId + '/shape/' + shape, '').map(res => res.json()).subscribe(response => {}, error => {})
  }

  findDashboardItemObject(dashboardItemId): Observable<any> {
    return Observable.create(observer => {
      this.find(dashboardItemId).subscribe(dashboardItem => {
        if(dashboardItem.hasOwnProperty('object')) {
          observer.next(dashboardItem.object);
          observer.complete();
        } else {
          this.http.get(this.constant.root_url + "api/"+this.utilService.formatEnumString(dashboardItem.type)+"s/"+dashboardItem[this.utilService.formatEnumString(dashboardItem.type)].id+".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],interpretations[id,%20text,lastUpdated,user[displayName],comments,likes],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]").map(res => res.json())
            .subscribe(
              object => {
                dashboardItem.object = object;
                observer.next(object);
                observer.complete();
              }, error => {
                observer.error();
              })
        }
      })
    })
  }

  findDashboardAnalyticObject(dashboardItemId) : Observable<any> {
    return Observable.create(observer => {
      let dashboardAnalyticObject = this.dashboardAnalyticObjects[dashboardItemId] ? this.dashboardAnalyticObjects[dashboardItemId] : null;
      if (!isNull(dashboardAnalyticObject)) {
        observer.next(dashboardAnalyticObject);
        observer.complete();
      } else {
        this.find(dashboardItemId).subscribe(dashboardItem => {
          this.http.get(this.constant.root_url + "api/"+this.utilService.formatEnumString(dashboardItem.type)+"s/"+dashboardItem[this.utilService.formatEnumString(dashboardItem.type)].id+".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],interpretations[id,%20text,lastUpdated,user[displayName],comments,likes],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]").map(res => res.json())
            .subscribe(
              dashboardObject => {
                this.http.get(this._getDashBoardItemAnalyticsUrl(dashboardObject, dashboardItem.type))
                  .map(res => res.json())
                  .catch(this.utilService.handleError)
                  .subscribe(analyticObject => {
                    this.dashboardAnalyticObjects[dashboardItemId] = analyticObject;
                    observer.next(analyticObject);
                    observer.complete()
                  })
              },
              dashboardObjectError => {
                observer.error(dashboardObjectError)
              })
        }, dashboardItemError => {
          observer.error(dashboardItemError)
        })
      }
    })
  }

  private _getDashBoardItemAnalyticsUrl(dashBoardObject, dashboardType): string {
        let url = this.constant.root_url + "api/analytics";
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
        if( dashboardType=="EVENT_CHART" ) {
            url += "/events/aggregate/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
        }else if ( dashboardType.type=="EVENT_REPORT" ) {
            if( dashBoardObject.dataType=="AGGREGATED_VALUES") {
                url += "/events/aggregate/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
            }else {
                url += "/events/query/"+dashBoardObject.program.id+".json?stage=" +dashBoardObject.programStage.id+"&";
            }

        }else if ( dashboardType.type=="EVENT_MAP" ) {
            url +="/events/aggregate/"+dashBoardObject.program.id+".json?stage="  +dashBoardObject.programStage.id+"&";
        }else {
            url += ".json?";
        }

        url += column+row;
        ( filter == "" )? url+"" : url += filter;
        url += "&displayProperty=NAME"+  dashboardType=="EVENT_CHART" ?
            "&outputType=EVENT&"
            : dashboardType=="EVENT_REPORT" ?
            "&outputType=EVENT&displayProperty=NAME"
            : dashboardType=="EVENT_MAP" ?
            "&outputType=EVENT&displayProperty=NAME"
            :"&displayProperty=NAME" ;
        return url;
  }

  getDashboardItemAnalyticsObject(dashboardItemData: any): Observable<any> {
      return Observable.create(observer => {
        let dashboardObject = this.dashboardAnalyticObjects[dashboardItemData.id] ? this.dashboardAnalyticObjects[dashboardItemData.id] : null;
        if(!isNull(dashboardObject)) {
          this.getAnalytic(dashboardObject, dashboardItemData.type).subscribe(analyticObject => {
            observer.next({analytic: analyticObject, dashboardObject: dashboardObject});
            observer.complete();
          }, error => {
            //@todo handle error
            observer.error(error);
            observer.complete()
          })
        } else {
          this.http.get(this.constant.root_url + "api/"+this.utilService.formatEnumString(dashboardItemData.type)+"s/"+dashboardItemData[this.utilService.formatEnumString(dashboardItemData.type)].id+".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],interpretations[id,%20text,lastUpdated,user[displayName],comments,likes],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]").map(res => res.json())
            .subscribe(dashboardObject => {
              //save to dashboardObject variable
              this.dashboardAnalyticObjects[dashboardItemData.id] = dashboardObject;
              this.getAnalytic(dashboardObject, dashboardItemData.type).subscribe(analyticObject => {
                observer.next({analytic: analyticObject, dashboardObject: dashboardObject});
                observer.complete()
              })
            }, error => {
              //@todo handle errors when dashboardObject could not be loaded
              console.log('error');
              observer.error(error);
              observer.complete()
            })
        }
      })
  }

  getAnalytic(dashboardObject, dashboardType) {
      return this.http.get(this._getDashBoardItemAnalyticsUrl(dashboardObject, dashboardType))
        .map(res => res.json())
        .catch(this.utilService.handleError)
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

  addDashboardItem(dashboardId, itemData): Observable<string> {
    return Observable.create(observer => {
      let options = new RequestOptions({headers: new Headers({'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'})});
      this.http.post(this._url + '/' + dashboardId + '/items/content?type=' + itemData.type + '&id=' + itemData.id, options)
        .map(res => res.json())
        .catch(this.utilService.handleError)
        .subscribe(response => {
            //get and update the created item
            this.dashboardService.load(dashboardId).subscribe(dashboard => {
              dashboard.dashboardItems.forEach(itemValue => {
                itemValue.shape = 'NORMAL';
                let index = -1;
                this.dashboardItems.forEach((dashboardItem, dashboardIndex) => {
                  if(itemValue.id == dashboardItem.id) {
                    index = dashboardIndex;
                  }
                });

                if(index == -1) {
                  this.dashboardItems.unshift(itemValue);
                } else {
                  this.dashboardItems[index] = itemValue;
                }
                this.updateShape(itemValue.id, 'NORMAL');
              })
            })
          observer.next('Item added');
          observer.complete()
          },
          error => {
            observer.error(error)
          })
    });
  }

  deleteDashboardItem(dashboardId, itemId) {
    //Delete from the pool first
    this.find(itemId).subscribe(dashboardItem => {
      this.dashboardItems.splice(this.dashboardItems.indexOf(dashboardItem),1);
    });
    return this.http.delete(this._url + '/' + dashboardId + '/items/' + itemId)
      .map((res: Response) => res.json())
  }

}
