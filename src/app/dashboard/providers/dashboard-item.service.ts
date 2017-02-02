import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable, BehaviorSubject} from "rxjs"
import {DashboardItem} from "../interfaces/dashboard-item";
import {UtilitiesService} from "./utilities.service";
import {Constants} from "../../shared/constants";
import {isNull} from "util";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class DashboardItemService {
  dashboardItems: DashboardItem[];
  dashboardObjects: Array<any>;
  private _url: string;
  constructor(
    private http: Http,
    private utilService: UtilitiesService,
    private constant: Constants
  ) {
    this._url = this.constant.root_url + 'api/dashboards';
    this.dashboardItems = [];
    this.dashboardObjects= [];
  }

  findByDashboard(dashboardId: string): Observable<DashboardItem> {
    return Observable.create(observer => {
      let dashboardItems: any = null;
      for(let dashboardItemData of this.dashboardItems) {
        if(dashboardItemData.id == dashboardId) {
          dashboardItems = dashboardItemData;
          break;
        }
      }
      if(!isNull(dashboardItems)) {
        observer.next(dashboardItems)
      } else {
        this.http.get(this._url + '/' + dashboardId + '.json?fields=id,dashboardItems[:all,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],resources[id,displayName],users[id,displayName]]')
          .map((res: Response) => res.json())
          .catch(this.utilService.handleError)
          .subscribe(
            dashboardItem => {
              this.dashboardItems.push(dashboardItem);
              observer.next(dashboardItem);
            },
            error => {
              observer.error(error)
            })
      }
    });
  }

  updateShape(dashboardItemId, dashboardId, shape): void {
    //update dashboard item pool
    this.findByDashboard(dashboardId).subscribe(dashboardItems => {
      for(let dashboardItem of dashboardItems.dashboardItems) {
        if(dashboardItem.id == dashboardItemId) dashboardItem.shape = shape;
      }
    });
    //update permanently to the source
    //@todo find best way to show success for no body request
    this.http.put(this.constant.root_url + 'api/dashboardItems/' + dashboardItemId + '/shape/' + shape, '').map(res => res.json()).subscribe(response => {}, error => {})
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
        let dashboardObject = this.dashboardObjects[dashboardItemData.id] ? this.dashboardObjects[dashboardItemData.id] : null;
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
              this.dashboardObjects[dashboardItemData.id] = dashboardObject;
              this.getAnalytic(dashboardObject, dashboardItemData.type).subscribe(analyticObject => {
                observer.next({analytic: analyticObject, dashboardObject: dashboardObject});
                observer.complete()
              })
            }, error => {
              //@todo handle errors when dashboardObject could not be loaded
              console.log('error')
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

  addDashboardItem(dashboardId, itemData) {
    let options = new RequestOptions({headers: new Headers({'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'})});
    this.http.post(this._url + '/' + dashboardId + '/items/content?type=' + itemData.type + '&id=' + itemData.id, options)
      .map(response => {
        //@todo find best way to get dashboarditem id
        let dashboardItemId: string = null;
        response.headers.forEach((headerItem, headerIndex) => {
          if(headerIndex == 'location') {
            dashboardItemId = headerItem[0].split("/")[2];
          }
        });
        return dashboardItemId;
      })
      .subscribe(
        dashboardItemId => {
          this.http.get(this.constant.root_url + 'api/dashboardItems/' + dashboardItemId + '?fields=:all,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],resources[id,displayName],users[id,displayName]')
            .map(res => res.json())
            .subscribe(
              (dashboardItem) => {
                //@todo find best way to add shape in an item
                for(let dashboardItemData of this.dashboardItems) {
                  if(dashboardItemData.id == dashboardId) {
                    dashboardItemData.dashboardItems.push(dashboardItem);
                    break;
                  }
                }
                this.updateShape(dashboardItemId,dashboardId,'NORMAL');
              }, error => {
                //@todo handle errors
              })
        },
        error => {
          console.log('error')
        })
  }

  deleteDashboardItem(dashboardId, itemId) {
    //Delete from the pool first
    for(let dashboardItemData of this.dashboardItems) {
      if(dashboardItemData.id == dashboardId) {
        for(let item of dashboardItemData.dashboardItems) {
          if(item.id == itemId) {
            console.log(dashboardItemData.dashboardItems.indexOf(item))
            dashboardItemData.dashboardItems.splice(dashboardItemData.dashboardItems.indexOf(item));
            break;
          }
        }
        break;
      }
    }
    this.http.delete(this._url + '/' + dashboardId + '/items/' + itemId)
      .map((res: Response) => res.json())
      .subscribe(
        response => {

        },
        error => {

        })
  }

}
