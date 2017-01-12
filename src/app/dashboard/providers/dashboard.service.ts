import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable, BehaviorSubject} from "rxjs"
import {Dashboard} from "../interfaces/dashboard";


@Injectable()
export class DashboardService {

  public dashboards: Observable<Dashboard[]>;
  private _dashboardsPool: BehaviorSubject<Dashboard[]>;
  private baseUrl: string;
  private dataStore: {
    dashboards: Dashboard[]
  };

  constructor(private http: Http) {
    this.baseUrl = '/api/dashboards';
    this.dataStore = {dashboards: []};
    this._dashboardsPool = <BehaviorSubject<Dashboard[]>> new BehaviorSubject([]);
    this.dashboards = this._dashboardsPool;
  }

  //Methods
  all(): Observable<Dashboard[]> {
    return Observable.create(observer => {
      this.dashboards.subscribe(pool => {
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
      this.http.get(this.baseUrl +  '.json?paging=false&fields=id,name').map(res => res.json()).subscribe(response => {
        let dashboardData = [];
        response.dashboards.forEach((dataItem, dataIndex) => {
          dashboardData[dataItem.id] = dataItem;
        });
        this.dataStore.dashboards = dashboardData;
        //persist dashboards into the pool
        this._dashboardsPool.next(Object.assign({}, this.dataStore).dashboards);
        observer.next(this._dashboardsPool);
        observer.complete();
      })
    })
  }

  find(id: string): Observable<Dashboard> {
    return Observable.create(observer => {
      this.dashboards.subscribe(dashboardData => {
        if(dashboardData[id]) {
          observer.next(dashboardData[id]);
          observer.complete();
        } else {
          //load from source if pool has no data
          this._loadAll().subscribe(dashboardData => {
            if(dashboardData[id]) {
              observer.next(dashboardData[id]);
              observer.complete();
            } else {
              observer.next('Dashboard with id "'+ id + '" could not be found or may have been deleted');
              observer.complete();
            }
          });
        }
      });
    });
  }

  create(dashboardData: Dashboard): Observable<string> {
    return Observable.create(observer => {
      this.http.post(this.baseUrl, dashboardData)
          .map(response => {
            //@todo find best way to pre-retrieve dashboard id after creation
            let dashboardid: string = null;
            response.headers.forEach((headerItem, headerIndex) => {
              if(headerIndex == 'location') {
                dashboardid = headerItem[0].split("/")[2];
              }
            });
            return {id: dashboardid, name:dashboardData.name};
          }).subscribe(response => {
        //@todo find best way to declare variable of type dashboard
        let data: any = {};
        data[response.id] = response;
        this.dataStore.dashboards.push(data);
        this._dashboardsPool.next(Object.assign({}, this.dataStore).dashboards);
        observer.next(response.id);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    })
  }

  update(dashboardData: Dashboard) {
    let dashboardid = dashboardData.id;
    this.http.put(this.baseUrl + '/'+ dashboardid, {name: dashboardData.name})
        .map(response => response.json())
        .subscribe(success => {
          //update the dashboardPool also
          this.dataStore.dashboards[dashboardid] = dashboardData;
          this._dashboardsPool.next(Object.assign({}, this.dataStore).dashboards);
        }, error => console.log('Could not update todo.'));
  }

  delete(dashboardId: string) {
    this.http.delete(this.baseUrl + '/' + dashboardId)
        .subscribe(response => {
          //refresh dashboard pool
          this._loadAll().subscribe(dashboardData => {
            console.log('refreshed');
          })
        }, error => console.log('error deleting dashboard'))
  }

  //@todo
  dashboardLoaded(): Observable<boolean> {
    return Observable.create(observer => {
      this.dashboards.subscribe(dashboard => {
        observer.next(true);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    })
  }
}
