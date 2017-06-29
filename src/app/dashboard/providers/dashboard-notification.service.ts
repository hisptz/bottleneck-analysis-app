import { Injectable } from '@angular/core';
import {HttpClientService} from '../../providers/http-client.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DashboardNotificationService {

  constructor(private http: HttpClientService) { }

  load(rootUrl): Observable<any> {
    return this.http.get(rootUrl + 'me/dashboard.json')
  }
}
