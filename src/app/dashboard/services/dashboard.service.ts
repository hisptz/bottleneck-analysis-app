import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import * as _ from 'lodash';

import { Dashboard } from '../models';
import { map, switchMap, catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class DashboardService {
  dashboardUrlFields: string;
  constructor(private httpClient: NgxDhis2HttpClientService) {
    this.dashboardUrlFields =
      '?fields=id,name,publicAccess,access,externalAccess,created,lastUpdated,favorite,' +
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

  bookmarkDashboard(
    dashboardId: string,
    bookmarked: boolean,
    supportBookmark: boolean,
    currentUserId: string
  ) {
    return supportBookmark
      ? this._bookmarkDashboardByApi(dashboardId, bookmarked)
      : this._bookmarkDashboardByDataStore(
          dashboardId,
          currentUserId,
          bookmarked
        );
  }

  private _bookmarkDashboardByApi(dashboardId: string, bookmarked: boolean) {
    return bookmarked
      ? this.httpClient.post(`dashboards/${dashboardId}/favorite`, {})
      : this.httpClient.delete(`dashboards/${dashboardId}/favorite`);
  }

  private _bookmarkDashboardByDataStore(
    dashboardId: string,
    currentUserId: string,
    bookmarked: boolean
  ) {
    return this.httpClient.get(`dataStore/dashboards/${dashboardId}`).pipe(
      switchMap((dashboardOption: any) =>
        this.httpClient.put(`dataStore/dashboards/${dashboardId}`, {
          ...dashboardOption,
          bookmarks: bookmarked
            ? dashboardOption.bookmarks.indexOf(currentUserId) === -1
              ? [...dashboardOption.bookmarks, currentUserId]
              : [...dashboardOption.bookmarks]
            : _.filter(
                dashboardOption.bookmarks,
                bookmark => bookmark !== currentUserId
              )
        })
      ),
      catchError(() =>
        this.httpClient.post(`dataStore/dashboards/${dashboardId}`, {
          id: dashboardId,
          bookmarks: [currentUserId]
        })
      )
    );
  }
}
