import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, Subject} from "rxjs"
import {Dashboard} from "../interfaces/dashboard";
import {Constants} from "../../shared/constants";
import {UtilitiesService} from "./utilities.service";
import {isNull} from "util";
import {isUndefined} from "util";

@Injectable()
export class DashboardService {
  dashboards: Dashboard[];
  dashboardName: string;
  url: string;
  dashboardLoaded= new Subject<boolean>();
  constructor(
    private http: Http,
    private constant: Constants,
    private utilService: UtilitiesService
  ) {
    this.url = this.constant.root_url + 'api/dashboards';
    this.dashboards = [];
    this.dashboardLoaded.next(false)
  }

  all(): Observable<Dashboard[]> {
    return Observable.create(observer => {
      if(this.dashboards.length > 0) {
        observer.next(this.dashboards);
        observer.complete();
      } else {
        this.http.get(this.url +  '.json?paging=false&fields=id,name,dashboardItems[id,type]')
          .map((res: Response) => res.json())
          .catch(this.utilService.handleError)
          .subscribe(
          response => {
            response.dashboards.map(dashboard => {
              if(isUndefined(this.dashboards.filter((item) => {return item.id == dashboard.id ? item : null;})[0])) {
                this.dashboards.push(dashboard)
              }
            });
            observer.next(this.dashboards);
            observer.complete()
          },
          error => {
            observer.next(error);
            observer.complete()
          })
      }
    });
  }

  find(id: string): Observable<Dashboard> {
    return Observable.create(observer => {
      let dashboard = this.dashboards.filter((item) => {return item.id == id ? item : null;})[0];
      if(isUndefined(dashboard)) {
        this.http.get(this.url + '/' + id + '.json?fields=id,name,dashboardItems[id,type]')
          .map((res: Response) => res.json())
          .catch(this.utilService.handleError)
          .subscribe(
            dashboard => {
              if(isUndefined(this.dashboards.filter((item) => {return item.id == id ? item : null;})[0])) {
                this.dashboards.push(dashboard);
              }
              observer.next(dashboard);
              observer.complete();
            },
            error => {
              observer.error(error)
            })
      } else {
        observer.next(dashboard);
        observer.complete()
      }
    })
  }

  setName(name : string, id?: string) {
    if(id) this.find(id).subscribe(dashboard => {this.dashboardName = dashboard.name;});
    if(!isNull(name)) this.dashboardName = name;
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
                this.dashboards.push(dashboardData);
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

    this.setName(dashboardData.name);
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

  dashboardsLoaded(): Observable<any> {
    return Observable.from(['2','3']);
    //return this.dashboardLoaded.asObservable();
  }
}
