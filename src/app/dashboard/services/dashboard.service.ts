import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

import { Dashboard } from '../models';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class DashboardService {
  dashboardUrlFields: string;
  constructor(private httpClient: NgxDhis2HttpClientService) {
    this.dashboardUrlFields =
      '?fields=id,name,publicAccess,access,externalAccess,created,lastUpdated,' +
      'user[id,name],dashboardItems[id,type,created,lastUpdated,shape,appKey,chart[id,displayName],' +
      'map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]&paging=false';
  }

  loadAll(): Observable<Dashboard[]> {
    return this.httpClient
      .get(`dashboards.json${this.dashboardUrlFields}`, true)
      .pipe(
        map((dashboardResponse: any) => dashboardResponse.dashboards || [])
      );
  }
}
