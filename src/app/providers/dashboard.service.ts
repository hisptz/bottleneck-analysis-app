import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Dashboard} from '../model/dashboard';
import {HttpClientService} from './http-client.service';
import {UtilitiesService} from './utilities.service';

@Injectable()
export class DashboardService {

  constructor(
    private http: HttpClientService,
    private utilities: UtilitiesService
  ) { }

  loadAll(rootUrl): Observable<Dashboard> {
    return this.http.get(rootUrl + 'dashboards.json?fields=id,name,dashboardItems[id,type,created,shape,reports[id,displayName],chart[id,displayName],map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],resources[id,displayName],users[id,displayName]')
      .map(dashboardResponse => { return dashboardResponse.dashboards });
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
      observer.next(dashboardData);
          observer.complete();
      this.http.put(apiRootUrl + 'dashboards/' + dashboardData.id, {name: dashboardData.name})
        .subscribe(() => {
          observer.next(dashboardData);
          observer.complete();
        }, error => observer.error(error))
    })
  }

  delete(dashboardDetails: any) {
    const apiRootUrl = dashboardDetails.apiRootUrl;
    return Observable.create(observer => {
      this.http.delete(apiRootUrl + 'dashboards/' + dashboardDetails.id)
        .subscribe(() => {
          observer.next(true);
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

}
