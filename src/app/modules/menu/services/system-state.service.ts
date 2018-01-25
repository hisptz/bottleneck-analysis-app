import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Injectable()
export class SystemStateService {
  constructor(private httpClient: HttpClient) {}

  checkLoginStatus(startTime: number = 1000, time: number = 5000) {
    return new Observable(observer => {
      Observable.timer(1000, time).subscribe(() => {
        this.pingServer().subscribe(
          pingStatus => {
            observer.next({ loggedIn: pingStatus.loggedIn, online: true });
          },
          error => {
            const newError = this._handleError(error);
            observer.next({
              online: newError.status === 200 ? true : false,
              loggedIn: newError.status === 200 ? false : undefined
            });
          }
        );
      });
    });
  }

  pingServer(): Observable<any> {
    return this.httpClient.get('../../../dhis-web-commons-stream/ping.action');
  }

  private _handleError(err: HttpErrorResponse) {
    let error = null;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      error = {
        message: err.error,
        status: err.status,
        statusText: err.statusText,
        url: err.url || ''
      };
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      error = {
        message: err.error instanceof Object ? err.error.message : err.error,
        status: err.status,
        statusText: err.statusText,
        url: err.url || ''
      };
    }

    return error;
  }
}
