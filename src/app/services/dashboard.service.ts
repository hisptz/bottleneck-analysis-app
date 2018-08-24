import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import * as _ from 'lodash';

import { Dashboard } from '../dashboard/models';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { DashboardSettings } from '../dashboard/models/dashboard-settings.model';
import { generateUid } from '../helpers/generate-uid.helper';
@Injectable({ providedIn: 'root' })
export class DashboardService {
  dashboardUrlFields: string;
  constructor(private httpClient: NgxDhis2HttpClientService) {
    this.dashboardUrlFields =
      '?fields=id,name,description,publicAccess,access,externalAccess,created,lastUpdated,favorite,' +
      'user[id,name],dashboardItems[id,type,created,lastUpdated,shape,appKey,chart[id,displayName],' +
      'map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]&paging=false';
  }

  loadAll(dashboardSettings: DashboardSettings): Observable<Dashboard[]> {
    return dashboardSettings && dashboardSettings.useDataStoreAsSource
      ? this.loadFromDataStore(dashboardSettings)
      : this.loadFromApi();
  }

  loadFromApi() {
    return this.httpClient
      .get(
        `dashboards.json?fields=id,name,description,access,created,lastUpdated,favorite,favorites&paging=false`
      )
      .pipe(
        map((dashboardResponse: any) => dashboardResponse.dashboards || [])
      );
  }

  loadFromDataStore(dashboardSettings: DashboardSettings) {
    return this.httpClient.get('dataStore/dashboards').pipe(
      mergeMap((dashboardIds: Array<string>) =>
        forkJoin(
          _.map(
            _.filter(dashboardIds, (dashboardId: string) => {
              const splitedDashboardId = dashboardId.split('_');
              const dashboardNamespace = splitedDashboardId[0] || '';
              return dashboardNamespace === dashboardSettings.id;
            }),
            dashboardId => {
              return this.httpClient.get(`dataStore/dashboards/${dashboardId}`);
            }
          )
        )
      ),
      catchError(() => of([]))
    );
  }

  load(
    id: string,
    dashboardSettings: DashboardSettings,
    customFields?: string
  ): Observable<Dashboard[]> {
    const dashboardUrl =
      dashboardSettings && dashboardSettings.useDataStoreAsSource
        ? `dataStore/dashboards/${id}`
        : `dashboards/${id}.json${customFields || this.dashboardUrlFields}`;
    return this.httpClient.get(dashboardUrl);
  }

  create(dashboard: Dashboard, dashboardSettings: DashboardSettings) {
    return dashboardSettings && dashboardSettings.useDataStoreAsSource
      ? this.httpClient.post(`dataStore/dashboards/${dashboard.id}`, {
          ...dashboard,
          namespace: dashboardSettings.id,
          dashbboardItems: []
        })
      : this.httpClient.post('dashboards.json', dashboard);
  }

  bookmarkDashboard(
    dashboardId: string,
    bookmarked: boolean,
    supportBookmark: boolean,
    currentUserId: string,
    dashboardSettings: DashboardSettings
  ) {
    return supportBookmark && !dashboardSettings.useDataStoreAsSource
      ? this._bookmarkDashboardByApi(dashboardId, bookmarked)
      : this._bookmarkDashboardByDataStore(
          dashboardId,
          currentUserId,
          bookmarked
        );
  }

  manageDashboardItem(
    dashboardId: string,
    dashboardItem: any,
    dashboardSettings: DashboardSettings,
    action: string
  ) {
    // TODO find best way for this as this approach is deprecated
    const dashboardLoadPromise =
      dashboardSettings && dashboardSettings.useDataStoreAsSource
        ? this.httpClient.get(`dataStore/dashboards/${dashboardId}`)
        : this.load(
            dashboardId,
            dashboardSettings,
            '?fields=id,created,lastUpdated,externalAccess,publicAccess,favorites,' +
              'translations,name,userAccesses,userGroupAccesses,dashboardItems[id,type,appKey,chart[id,name],' +
              'map[id,name],reportTable[id,name],eventReport[id,name],eventChart[id,name]]'
          );

    return dashboardLoadPromise.pipe(
      switchMap((dashboard: any) => {
        const newDashboardItem = {
          ...dashboardItem,
          id: dashboardItem.id || generateUid()
        };

        const newDashboardItems = this._manageDasboardItems(
          dashboard.dashboardItems || [],
          newDashboardItem,
          action
        );

        const dashboardUpdateUrl =
          dashboardSettings && dashboardSettings.useDataStoreAsSource
            ? `dataStore/dashboards/${dashboardId}`
            : `dashboards/${dashboardId}?mergeMode=MERGE`;
        return this.httpClient
          .put(dashboardUpdateUrl, {
            ...dashboard,
            dashboardItems: newDashboardItems
          })
          .pipe(
            map(() => {
              return { dashboardId, dashboardItem: newDashboardItem, action };
            })
          );
      })
    );
  }

  private _manageDasboardItems(
    dashboardItems: any[],
    incomingDashboardItem: any,
    action: string
  ) {
    switch (action) {
      case 'ADD': {
        return [incomingDashboardItem, ...dashboardItems];
      }
      case 'UPDATE': {
        const correspondingDashboardItem = _.find(dashboardItems, [
          'id',
          incomingDashboardItem.id
        ]);
        const dashboardItemIndex = dashboardItems.indexOf(
          correspondingDashboardItem
        );

        return dashboardItemIndex !== -1
          ? [
              ..._.slice(dashboardItems, 0, dashboardItemIndex),
              incomingDashboardItem,
              ..._.slice(dashboardItems, dashboardItemIndex + 1)
            ]
          : dashboardItems;
      }
      case 'DELETE': {
        const correspondingDashboardItem = _.find(dashboardItems, [
          'id',
          incomingDashboardItem.id
        ]);
        const dashboardItemIndex = dashboardItems.indexOf(
          correspondingDashboardItem
        );
        return dashboardItemIndex !== -1
          ? [
              ..._.slice(dashboardItems, 0, dashboardItemIndex),
              ..._.slice(dashboardItems, dashboardItemIndex + 1)
            ]
          : dashboardItems;
      }
      default:
        return dashboardItems;
    }
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
      switchMap((dashboard: any) => {
        const dashboardBookmarks = dashboard.bookmarks || [];
        return this.httpClient.put(`dataStore/dashboards/${dashboardId}`, {
          ...dashboard,
          bookmarks: bookmarked
            ? dashboardBookmarks.indexOf(currentUserId) === -1
              ? [...dashboardBookmarks, currentUserId]
              : [...dashboardBookmarks]
            : _.filter(
                dashboardBookmarks || [],
                bookmark => bookmark !== currentUserId
              )
        });
      }),
      catchError((error: any) =>
        this.httpClient.post(`dataStore/dashboards/${dashboardId}`, {
          id: dashboardId,
          bookmarks: [currentUserId]
        })
      )
    );
  }
}
