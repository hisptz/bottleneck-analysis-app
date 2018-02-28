import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../services/http-client.service';
import { Observable } from 'rxjs/Observable';
import { forkJoin} from 'rxjs/observable/forkJoin';
import * as _ from 'lodash';

@Injectable()
export class SharingService {
  private _searchList: any[];
  private _searchListLoaded: boolean;
  constructor(private httpClient: HttpClientService) {
    this._searchList = [];
    this._searchListLoaded = false;
  }

  getSearchList(): Observable<any[]> {
    return new Observable(observer => {
      if (this._searchListLoaded) {
        observer.next(this._searchList);
        observer.complete();
      } else {
        forkJoin(
          this.getUserList(),
          this.getUserGroupList()
        ).subscribe(
          response => {
            this._searchList = _.sortBy(_.flatten(response), 'name');
            this._searchListLoaded = true;
            observer.next(this._searchList);
            observer.complete();
          },
          () => {
            observer.next(null);
            observer.complete();
          }
        );
      }
    });
  }

  getUserList(): Observable<any> {
    return this.httpClient
      .get('users.json?fields=id,name,displayName&paging=false')
      .map(res => res.users || [])
      .map((userResponse: any[]) => {
        return _.map(userResponse, (user: any) => {
          return {
            ...user,
            type: 'user'
          };
        });
      });
  }

  getUserGroupList(): Observable<any> {
    return this.httpClient
      .get('userGroups.json?fields=id,name,displayName&paging=false')
      .map((res: any) => res.userGroups || [])
      .map((userGroupResponse: any[]) => {
        return _.map(userGroupResponse, (userGroup: any) => {
          return {
            ...userGroup,
            type: 'userGroup'
          };
        });
      });
  }

  saveSharingResults(sharingObject: any, sharingType: string, sharingId: string) {
    return this.httpClient.post(`sharing?type=${sharingType}&id=${sharingId}`, {object: sharingObject});
  }
}
