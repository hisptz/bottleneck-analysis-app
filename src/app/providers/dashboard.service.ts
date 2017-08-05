import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Dashboard} from '../model/dashboard';
import {HttpClientService} from './http-client.service';
import {UtilitiesService} from './utilities.service';
import * as _ from 'lodash';
import {Router} from '@angular/router';
@Injectable()
export class DashboardService {

  constructor(
    private http: HttpClientService,
    private utilities: UtilitiesService,
    private router: Router
  ) { }

  loadAll(rootUrl): Observable<any> {
    return Observable.create(observer => {
      this.http.get(rootUrl + 'dashboards.json?fields=id,name,dashboardItems[id,type,created,shape,appKey,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],resources[id,displayName],users[id,displayName]')
        .subscribe(dashboardResponse => {
          observer.next(dashboardResponse);
          observer.complete();
        }, error => {
          observer.next(error);
          observer.complete();
        });
    });
  }

  load(rootUrl, id) {
    return this.http.get(rootUrl + 'dashboards/' + id + '.json?fields=id,name,dashboardItems[id,type,created,shape,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],resources[id,displayName],users[id,displayName]]');
  }

  create(dashboardDetails: any): Observable<Dashboard> {
    const apiRootUrl = dashboardDetails.apiRootUrl;
    const dashboardData: Dashboard = dashboardDetails.dashboardData;
    return Observable.create(observer => {
      this.utilities.getUniqueId(apiRootUrl)
        .subscribe((uniqueId: string) => {
          dashboardData.id = uniqueId;
          this.http.post(apiRootUrl + 'dashboards', dashboardData).subscribe(() => {
            this.load(apiRootUrl, uniqueId).subscribe((dashboard: any) => {
              observer.next(dashboard);
              observer.complete();
            }, dashboardLoadError => observer.error(dashboardLoadError))
          }, dashboardCreationError => observer.error(dashboardCreationError));
        }, uniqueIdError => observer.error(uniqueIdError));
    })
  }

  edit(dashboardDetails: any): Observable<Dashboard> {
    const apiRootUrl = dashboardDetails.apiRootUrl;
    const dashboardData: Dashboard = dashboardDetails.dashboardData;
    return Observable.create(observer => {
      this.http.put(apiRootUrl + 'dashboards/' + dashboardData.id, {name: dashboardData.name})
        .subscribe(() => {
          observer.next(dashboardData);
          observer.complete();
        }, error => {
          observer.next({error: error, dashboardData: dashboardData});
          observer.complete();
        })
    })
  }

  delete(dashboardDetails: any) {
    const apiRootUrl = dashboardDetails.apiRootUrl;
    return Observable.create(observer => {
      this.http.delete(apiRootUrl + 'dashboards/' + dashboardDetails.id)
        .subscribe(() => {
          dashboardDetails.deleted = true;
          observer.next(dashboardDetails);
          observer.complete();
        }, error => observer.error(error))
    });
  }

  resize(dashboardDetails: any) {
    const apiRootUrl = dashboardDetails.apiRootUrl;
    return Observable.create(observer => {
      this.http.put(apiRootUrl + 'dashboardItems/' + dashboardDetails.id + '/shape/' + dashboardDetails.shape, '')
        .subscribe(() => {
          observer.next(true);
          observer.complete();
        }, error => observer.error(error))
    })
  }

  loadCustomDashboardSettings(apiRootUrl) {
    return Observable.create(observer => {
      this.http.get(apiRootUrl + 'dataStore/idashboard/customSettings')
        .subscribe(predefinedDashboards => {
          observer.next(predefinedDashboards);
          observer.complete();
        }, () => {
          observer.next(null);
          observer.complete();
        })
    })
  }

  updateCustomDashboardSettings(dashboardSettingsDetails: any) {
    const apiRootUrl = dashboardSettingsDetails.apiRootUrl;
    return Observable.create(observer => {
      this.loadCustomDashboardSettings(dashboardSettingsDetails.apiRootUrl)
        .subscribe(customSettings => {
          if (customSettings === null) {
            this.http.post(apiRootUrl + 'dataStore/idashboard/customSettings', dashboardSettingsDetails.dashboardGroupSettings)
              .subscribe(() => {
                observer.next(true);
                observer.complete()
              })
          } else {
            this.http.put(apiRootUrl + 'dataStore/idashboard/customSettings', dashboardSettingsDetails.dashboardGroupSettings)
              .subscribe(() => {
                observer.next(true);
                observer.complete()
              })
          }
        })
    })
  }

  loadSearchItems(searchDetails) {
    return Observable.create(observer => {
      this.http.get(searchDetails.apiRootUrl + 'dashboards/q/' + searchDetails.searchText + '.json?max=USERS&&max=MAP&max=REPORT_TABLE&max=CHART&max=EVENT_CHART&max=EVENT_REPORT&max=RESOURCES&max=REPORTS&max=APP')
        .subscribe(searchResult => {
          observer.next(searchResult);
          observer.complete();
        }, searchError => {
          observer.next(null);
          observer.complete();
        })
    });
  }

  addItems(dashboardDetails) {
    const dashboardItemType: string = dashboardDetails.dashboardItemData.type;
    const favoriteId: string = dashboardDetails.dashboardItemData.id;
    const dashboardId: string = dashboardDetails.dashboardItemData.dashboardId;
    return Observable.create(observer => {
      this.http.post(
        dashboardDetails.apiRootUrl +
        'dashboards/' + dashboardId +
        '/items/content?type=' + dashboardItemType +
        '&id=' + favoriteId, {})
        .subscribe(() => {
          this.load(dashboardDetails.apiRootUrl, dashboardId)
            .subscribe((dashboard: any) => {
              observer.next({
                dashboardId: dashboardId,
                dashboardItems: this._retrieveAddedItem(dashboard.dashboardItems, dashboardItemType, favoriteId)
              });
              observer.complete()
            }, () => {
              observer.next({
                dashboardId: dashboardId,
                dashboardItems: []
              });
              observer.complete()
            });
        }, () => {
          observer.next({
            dashboardId: dashboardId,
            dashboardItems: []
          });
          observer.complete()
        });
    });
  }

  private _retrieveAddedItem(dashboardItems, dashboardItemType, favoriteId) {
    let newItems = [];
    if (dashboardItemType[dashboardItemType.length - 1] === 'S') {
      newItems = _.clone(dashboardItems.filter(item => { return item.type[dashboardItemType.length - 1] === 'S'}));
    } else {
      for (const item of dashboardItems) {
        const itemTypeObject = item[_.camelCase(dashboardItemType)];
        if (itemTypeObject) {
          if (itemTypeObject.id === favoriteId ) {
            newItems = [item];
            break;
          }
        }
      }
    }
     return newItems;
  }

  deleteItem(dashboardDetails): Observable<any> {
    return Observable.create(observer => {
      this.http.delete(
        dashboardDetails.apiRootUrl + 'dashboards/' +
        dashboardDetails.dashboardId +
        '/items/' + dashboardDetails.visualizationObjectId
      ).subscribe(() => {
        dashboardDetails.deleted = true;
        observer.next(dashboardDetails);
        observer.complete();
      }, () => {
        dashboardDetails.deleted = false;
        observer.next(dashboardDetails);
        observer.complete();
      })
    })
  }

  navigateToDashboard(dashboard) {
    if (dashboard.deleted) {
      this.router.navigate(['/'])
    } else {
      this.router.navigate(['/dashboards/' + dashboard.id]);
    }
  }

}
