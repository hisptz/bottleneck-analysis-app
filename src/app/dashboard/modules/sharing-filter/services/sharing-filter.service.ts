import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import * as _ from 'lodash';
import { SharingSearchList } from '../models/sharing-search-list.model';

@Injectable({ providedIn: 'root' })
export class SharingFilterService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadSharing(
    id: string,
    itemType: string,
    // TODO REMOVE DEFAULT PREFERENCES BY PASSING PREFERENCES
    sharingPreferences: { useDataStoreAsSource: boolean } = {
      useDataStoreAsSource: true
    },
    // TODO REMOVE THIS HARDCORDING BY PASSING NAMESPACE
    namespace: string = 'bna-dashboard'
  ) {
    return sharingPreferences && sharingPreferences.useDataStoreAsSource
      ? this.loadSharingFromDataStore(id, itemType, namespace)
      : this.loadSharingFromApi(id, itemType);
  }

  loadSharingFromApi(id: string, itemType: string): Observable<any> {
    return this.httpClient
      .get(`sharing?type=${itemType}&id=${id}`)
      .pipe(
        map(
          (sharingResponse: any) =>
            sharingResponse ? sharingResponse.object : null
        )
      );
  }

  loadSharingFromDataStore(
    id: string,
    itemType: string,
    namespace
  ): Observable<any> {
    return this.httpClient.get(`dataStore/${itemType}s/${namespace}_${id}`);
  }

  saveSharing(
    sharingObject: any,
    sharingType: string,
    sharingId: string,
    // TODO REMOVE DEFAULT PREFERENCES BY PASSING PREFERENCES
    sharingPreferences: { useDataStoreAsSource: boolean } = {
      useDataStoreAsSource: true
    },
    // TODO REMOVE THIS HARDCORDING BY PASSING NAMESPACE
    namespace: string = 'bna-dashboard'
  ) {
    return sharingPreferences && sharingPreferences.useDataStoreAsSource
      ? this.saveSharingToDataStore(
          sharingId,
          sharingType,
          namespace,
          sharingObject
        )
      : this.saveSharingToApi(sharingType, sharingId, sharingObject);
  }

  saveSharingToApi(sharingType: string, sharingId: string, sharingObject: any) {
    return this.httpClient.post(`sharing?type=${sharingType}&id=${sharingId}`, {
      object: sharingObject
    });
  }

  saveSharingToDataStore(
    id: string,
    itemType: string,
    namespace: string,
    sharingObject: any
  ) {
    return this.loadSharingFromDataStore(id, itemType, namespace).pipe(
      switchMap((sharingObjectFromDataStore: any) =>
        this.httpClient.put(`dataStore/${itemType}s/${namespace}_${id}`, {
          ...sharingObjectFromDataStore,
          ...sharingObject
        })
      )
    );
  }

  loadSharingListForSearch(): Observable<SharingSearchList[]> {
    return forkJoin(this._getUserList(), this._getUserGroupList()).pipe(
      map((results: any[]) => _.flatten(results))
    );
  }

  private _getUserList(): Observable<any> {
    return this.httpClient
      .get('users.json?fields=id,name,displayName&paging=false')
      .pipe(
        map((res: any) => res.users || []),
        map((userResponse: any[]) => {
          return _.map(userResponse, (user: any) => {
            return {
              ...user,
              type: 'user'
            };
          });
        })
      );
  }

  private _getUserGroupList(): Observable<any> {
    return this.httpClient
      .get('userGroups.json?fields=id,name,displayName&paging=false')
      .pipe(
        map((res: any) => res.userGroups || []),
        map((userGroupResponse: any[]) => {
          return _.map(userGroupResponse, (userGroup: any) => {
            return {
              ...userGroup,
              type: 'userGroup'
            };
          });
        })
      );
  }
}
