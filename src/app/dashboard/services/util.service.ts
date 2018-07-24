import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getUniqueId(): Observable<string> {
    return this.httpClient
      .get('system/id.json?n=1')
      .pipe(
        map(
          (response: any) =>
            response && response.codes ? response.codes[0] : ''
        )
      );
  }
}
