import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientService} from './http-client.service';

@Injectable()
export class UtilitiesService {

  constructor(private http: HttpClientService) { }

  getUniqueId(apiRootUrl): Observable<string> {
    return Observable.create(observer => {
      this.http.get(apiRootUrl + 'system/id.json?n=1')
        .subscribe(
          response => {
            observer.next(response['codes'][0]);
            observer.complete();
          }, error => observer.error(error))
    })
  }
}
