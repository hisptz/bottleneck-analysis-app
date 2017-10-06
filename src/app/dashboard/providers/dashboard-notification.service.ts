import { Injectable } from '@angular/core';
import {HttpClientService} from '../../providers/http-client.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DashboardNotificationService {

  constructor(private http: HttpClientService) { }

  load(rootUrl): Observable<any> {
    return Observable.create(observer => {
      this.http.get(rootUrl + 'me/dashboard.json')
        .subscribe(notification => {
          observer.next(notification);
          observer.complete();
        }, () => {
          observer.next({
            unreadMessageConversation: 0,
            unreadInterpretations: 0
          });
          observer.complete();
        })
    })
  }
}
