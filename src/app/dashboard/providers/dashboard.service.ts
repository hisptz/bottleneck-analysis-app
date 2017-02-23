import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable, Subject} from "rxjs"
import {Dashboard} from "../interfaces/dashboard";
import {Constants} from "../../shared/constants";
import {UtilitiesService} from "./utilities.service";
import {isNull} from "util";
import {isUndefined} from "util";

@Injectable()
export class DashboardService {
  dashboards: Dashboard[];
  url: string;
  constructor(
    private http: Http,
    private constant: Constants,
    private utilService: UtilitiesService
  ) {
    this.url = this.constant.api + 'dashboards';
    this.dashboards = [];
  }

  all(): Observable<Dashboard[]> {
    return Observable.create(observer => {
      if(this.dashboards.length > 0) {
        observer.next(this.dashboards);
        observer.complete();
      } else {
        this.http.get(this.url +  '.json?paging=false&fields=id,name,dashboardItems[:all,users[:all],resources[:all],reports[:all]]')
          .map((res: Response) => res.json())
          .catch(this.utilService.handleError)
          .subscribe(response => {
            response.dashboards.forEach(dashboard => {
              if(isUndefined(this.dashboards.filter((item) => {return item.id == dashboard.id ? item : null;})[0])) {
                this.dashboards.push(dashboard)
              }
            });
            observer.next(this.dashboards);
            observer.complete()
          }, error => {
            observer.next(error);
            observer.complete();
          })
      }
    });
  }

  getDashboardItemWithObjectAndAnalytics(dashboardId, dashboardItemId, currentUserId) {
    return Observable.create(observer => {
      let dashboard = this.dashboards.filter((item) => {return item.id == dashboardId ? item : null;})[0];
      let dashboardIndex = this.dashboards.indexOf(dashboard);
      dashboard.dashboardItems.forEach((dashboardItem) => {
        if(dashboardItem.id == dashboardItemId) {
          if(dashboardItem.hasOwnProperty('object')) {
            observer.next(dashboardItem)
          } else {
            this.http.get(this.constant.root_url + "api/"+this.utilService.formatEnumString(dashboardItem.type)+"s/"+dashboardItem[this.utilService.formatEnumString(dashboardItem.type)].id+".json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],interpretations[id,%20text,lastUpdated,user[displayName],comments,likes],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]")
              .map(res => res.json())
              .catch(this.utilService.handleError)
              .subscribe(dashboardObject => {
                dashboardItem['object'] = dashboardObject;
                //get analytic object also
                this.http.get(this._getDashBoardItemAnalyticsUrl(dashboardObject,dashboardItem.type,currentUserId))
                  .map(res => res.json())
                  .catch(this.utilService.handleError)
                  .subscribe(analyticObject => {
                    dashboardItem['analytic'] = analyticObject;

                    //also persist in the pool
                    this.dashboards[dashboardIndex] = dashboard;
                    observer.next(dashboardItem);
                  }, analyticError => observer.error(analyticError));
              },error => {observer.error(error)})
          }
        }
      });
    })
  }

  find(id: string): Observable<Dashboard> {
    return Observable.create(observer => {
      let dashboard = this.dashboards.filter((item) => {return item.id == id ? item : null;})[0];
      if(isUndefined(dashboard)) {
        this.load(id).subscribe(dashboard => {
              observer.next(dashboard);
              observer.complete();
            }, error => {
              observer.error(error)
            })
      } else {
        observer.next(dashboard);
        observer.complete()
      }
    })
  }

  load(id: string): Observable<any> {
    return Observable.create(observer => {
      this.http.get(this.url + '/' + id + '.json?fields=id,name,dashboardItems[:all,users[:all],resources[:all],reports[:all]]')
        .map((res: Response) => res.json())
        .catch(this.utilService.handleError)
        .subscribe(dashboard => {
          if(isUndefined(this.dashboards.filter((item) => {return item.id == id ? item : null;})[0])) {
            this.dashboards.push(dashboard);
          } else {
            this.dashboards.forEach((dashboardItem, dashboardIndex) => {
              if(dashboardItem.id == id) this.dashboards[dashboardIndex] = dashboard;
            });
          }

          observer.next(dashboard);
          observer.complete();
        }, error => {
          observer.error(error)
        })
    })
  }

  create(dashboardData: Dashboard): Observable<string> {
    return Observable.create(observer => {
      this.utilService.getUniqueId()
        .subscribe(uniqueId => {
          dashboardData.id = uniqueId;
          this.http.post(this.url, dashboardData)
            .map(res => res.json())
            .catch(this.utilService.handleError)
            .subscribe(
              response => {
                observer.next(uniqueId);
                observer.complete();
              },
              error => {
                observer.error(error);
              });
        })
    })
  }

  update(dashboardData: Dashboard): Observable<any> {
    for(let dashboard of this.dashboards) {
      if(dashboard.id == dashboardData.id) {
        this.dashboards[this.dashboards.indexOf(dashboard)] = dashboardData;
        break;
      }
    }
    return this.http.put(this.url + '/'+ dashboardData.id, {name: dashboardData.name})
      .catch(this.utilService.handleError)
  }

  delete(id: string): Observable<any> {

    for(let dashboard of this.dashboards) {
      if(dashboard.id == id) {
        this.dashboards.splice(this.dashboards.indexOf(dashboard),1);
        break;
      }
    }
    return this.http.delete(this.url + '/' + id)
      .map((res: Response) => res.json())
      .catch(this.utilService.handleError)
  }

  removeDashboardItem(dashboardItemId, dashboardId) {
    this.find(dashboardId).subscribe(dashboard => {
      dashboard.dashboardItems.splice(dashboard.dashboardItems.indexOf({id: dashboardItemId}),1)
    })
  }

  private _getDashBoardItemAnalyticsUrl(dashBoardObject, dashboardType, currentUserId): string {
    let url = this.constant.root_url + "api/25/analytics";
    let column = "";
    let row = "";
    let filter = "";
    //checking for columns
    dashBoardObject.columns.forEach((dashBoardObjectColumn : any,index : any)=>{
      let items = "";
      if(dashBoardObjectColumn.dimension != "dy"){
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

    url += "&user=" + currentUserId;
    return url;
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

  updateShape(dashboardId, dashboardItemId, shape): void {
    //update dashboard item pool
    this.find(dashboardId).subscribe(
      dashboard => {
        for(let dashboardItem of dashboard.dashboardItems) {
          if(dashboardItem.id == dashboardItemId) {
            dashboardItem.shape = shape;
            break;
          }
        }
      });
    //update permanently to the source
    //@todo find best way to show success for no body request
    this.http.put(this.constant.root_url + 'api/dashboardItems/' + dashboardItemId + '/shape/' + shape, '').map(res => res.json()).subscribe(response => {}, error => {console.log(error)})
  }

  addDashboardItem(dashboardId, dashboardItemData): Observable<string> {
    return Observable.create(observer => {
      let options = new RequestOptions({headers: new Headers({'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'})});
      this.http.post(this.url + '/' + dashboardId + '/items/content?type=' + dashboardItemData.type + '&id=' + dashboardItemData.id, options)
        .map(res => res.json())
        .catch(this.utilService.handleError)
        .subscribe(response => {
            //get and update the created item
            this.load(dashboardId).subscribe(dashboard => {
              dashboard.dashboardItems.forEach(dashboardItem => {
                if(!dashboardItem.hasOwnProperty('shape'))  {
                  dashboardItem.shape = 'NORMAL';
                  this.updateShape(dashboardId,dashboardItem.id, 'NORMAL');
                }
              })
              observer.next('Item added');
              observer.complete()
            }, error => {console.log('failed to load dashboard')});
          },
          error => {
            observer.error(error)
          })
    });
  }

  deleteDashboardItem(dashboardId, dashboardItemId) {
    //Delete from the pool first
    this.find(dashboardId).subscribe(dashboard => {
      for(let dashboardItem of dashboard.dashboardItems) {
        if(dashboardItem.id == dashboardItemId) {
          dashboard.dashboardItems.splice(dashboard.dashboardItems.indexOf(dashboardItem),1)
        }
      }
    });
    return this.http.delete(this.url + '/' + dashboardId + '/items/' + dashboardItemId)
      .map((res: Response) => res.json())
  }
}
