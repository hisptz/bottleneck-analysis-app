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

  getCurrentUser(): Observable<any> {
    return Observable.create(observer => {
      if(this.currentUser.hasOwnProperty('id')) {
        observer.next(this.currentUser);
        observer.complete();
      } else {
        this.http.get(this.constants.api + 'me.json')
          .map((res: Response) => res.json())
          .catch(this.utilService.handleError)
          .subscribe(currentUser => {
          this.currentUser = currentUser;
          observer.next(currentUser);
          observer.complete()
        }, error => {observer.error(error)});
      }
    });
  }

}
