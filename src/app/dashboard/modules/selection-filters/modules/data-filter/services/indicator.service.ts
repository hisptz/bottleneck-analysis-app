import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IndicatorService {
  constructor(private http: NgxDhis2HttpClientService) {}

  loadAll() {
    return this.http
      .get('indicators.json?fields=id,name,shortName,code&paging=false')
      .pipe(map(res => res.indicators || []));
  }
}
