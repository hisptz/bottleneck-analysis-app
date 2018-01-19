import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../services/http-client.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Injectable()
export class SharingService {
  constructor(private httpClient: HttpClientService) {}

  searchSharingDetails(searchTerm: string) {
    return new Observable(observer => {
      this.httpClient
        .get('sharing/search?key=' + searchTerm + '&paging=false')
        .subscribe(
          (userGroupResponse: any) => {
            observer.next(userGroupResponse);
            observer.complete();
          },
          () => {
            observer.next(null);
            observer.complete();
          }
        );
    });
  }

  getSearchList(): Observable<any[]> {
    return new Observable(observer => {
      Observable.forkJoin(
        this.getUserList(),
        this.getUserGroupList()
      ).subscribe(
        response => {
          observer.next(_.sortBy(_.flatten(response), 'name'));
          observer.complete();
        },
        () => {
          observer.next(null);
          observer.complete();
        }
      );
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
}
