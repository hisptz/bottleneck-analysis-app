import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable, BehaviorSubject} from "rxjs"
import {DashboardItem} from "../interfaces/dashboard-item";


@Injectable()
export class DashboardItemService {

  public dashboardItems: Observable<DashboardItem[]>;
  private _dashboardItemsPool: BehaviorSubject<DashboardItem[]>;
  private baseUrl: string;
  private dataStore: {
    dashboardItems: DashboardItem[]
  };

  constructor(private http: Http) {
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

  delete(dashboardItemId: string) {
    this.http.delete(this.baseUrl + '/' + dashboardItemId)
        .subscribe(response => {
          //refresh dashboardItem pool
          this._loadAll().subscribe(dashboardItemData => {
            console.log('refreshed');
          })
        }, error => console.log('error deleting dashboardItem'))
  }

  //@todo
  dashboardItemLoaded(): Observable<boolean> {
    return Observable.create(observer => {
      this.dashboardItems.subscribe(dashboardItem => {
        observer.next(true);
        observer.complete();
      }, error => {
        observer.error(error);
      })
    })
  }
}
