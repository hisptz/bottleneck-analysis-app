import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { SharingSearchList } from '../models/sharing-search-list.model';

@Injectable({ providedIn: 'root' })
export class SharingFilterService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadSharing(id: string, itemType: string) {
    return this.httpClient
      .get(`sharing?type=${itemType}&id=${id}`)
      .pipe(
        map(
          (sharingResponse: any) =>
            sharingResponse ? sharingResponse.object : null
        )
      );
  }

  loadSharingFromDataStore() {}

  saveSharing(sharingObject: any, sharingType: string, sharingId: string) {
    return this.httpClient.post(`sharing?type=${sharingType}&id=${sharingId}`, {
      object: sharingObject
    });
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
