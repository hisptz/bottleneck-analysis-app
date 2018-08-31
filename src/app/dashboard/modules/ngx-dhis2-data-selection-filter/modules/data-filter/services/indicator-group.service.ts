import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

@Injectable({ providedIn: 'root' })
export class IndicatorGroupService {
  constructor(private http: NgxDhis2HttpClientService) {}

  loadAll() {
    return this._loadFromApi();
  }

  private _loadFromApi() {
    return this.http
      .get('indicatorGroups.json?fields=id,name,indicators[id]&paging=false')
      .pipe(map(res => res.indicatorGroups || []));
  }
}
