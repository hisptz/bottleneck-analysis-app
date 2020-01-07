import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IndicatorGroupService {
  constructor(private http: NgxDhis2HttpClientService) {}

  loadAll() {
    return this.http
      .get('indicatorGroups.json?fields=id,name,indicators[id]&paging=false')
      .pipe(map(res => res.indicatorGroups || []));
  }
}
