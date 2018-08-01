import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

@Injectable({ providedIn: 'root' })
export class SystemService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getSystemInfo(): Observable<any> {
    return this.httpClient.get('system/info.json');
  }

  getGoogleEarthToken(): Observable<any> {
    return this.httpClient.get('tokens/google');
  }

  getMapID(): Observable<any> {
    return this.httpClient.get('tokens/google');
  }
}
