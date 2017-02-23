import { Injectable } from '@angular/core';
import {Constants} from "../constants";
import {Observable} from "rxjs";
import {Http, Response} from "@angular/http";
import {UtilitiesService} from "../../dashboard/providers/utilities.service";

@Injectable()
export class CurrentUserService {

  currentUser: any;
  constructor(
    private constants: Constants,
    private http: Http,
    private utilService: UtilitiesService
  ) {
    this.currentUser = {};
  }

  getCurrentUserOrgUnits(): Observable<Array<any>> {
    return Observable.create(observer => {
      let userOrgUnits = [];
      if(this.currentUser.hasOwnProperty('dataViewOrganisationUnits')) {
        this.currentUser.dataViewOrganisationUnits.forEach(orgUnit => {
          userOrgUnits.push(orgUnit.id);
        })
        observer.next(userOrgUnits);
        observer.complete();
      } else {
        this.loadCurrentUser().subscribe(currentUser => {
          this.currentUser = currentUser;
          currentUser.dataViewOrganisationUnits.forEach(orgUnit => {
            userOrgUnits.push(orgUnit.id);
          })
          observer.next(userOrgUnits);
          observer.complete();
        }, error => observer.error())
      }
    })
  }

  getCurrentUserId(): Observable<string> {
    return Observable.create(observer => {
      if(this.currentUser.hasOwnProperty('id')) {
        observer.next(this.currentUser.id);
        observer.complete();
      } else {
        this.loadCurrentUser().subscribe(currentUser => {
            this.currentUser = currentUser;
            observer.next(currentUser.id);
            observer.complete()
          }, error => {observer.error(error)});
      }
    });
  }
  getCurrentUsername(): Observable<string> {
    return Observable.create(observer => {
      if(this.currentUser.hasOwnProperty('id')) {
        observer.next(this.currentUser.userCredentials.username);
        observer.complete();
      } else {
        this.loadCurrentUser().subscribe(currentUser => {
          this.currentUser = currentUser;
          observer.next(currentUser.userCredentials.username);
          observer.complete()
        }, error => {observer.error(error)});
      }
    });
  }

  loadCurrentUser(): Observable<any> {
    return  this.http.get(this.constants.api + 'me.json')
      .map((res: Response) => res.json())
      .catch(this.utilService.handleError)
  }
}
