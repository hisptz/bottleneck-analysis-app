import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

@Injectable({ providedIn: 'root' })
export class IndicatorService {
  constructor(private http: NgxDhis2HttpClientService) {}

  loadAll() {
    return this._loadFromApi();
  }

  private _loadFromApi() {
    return this.http
      .get('indicators.json?fields=id,name,code&paging=false')
      .pipe(map(res => res.indicators || []));
  }
}
