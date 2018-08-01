import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { OrgUnitLevel } from '../models';

@Injectable({ providedIn: 'root' })
export class OrgUnitLevelService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadAll(): Observable<OrgUnitLevel> {
    return this.httpClient
      .get(
        `organisationUnitLevels.json?fields=id,name,level&paging=false&order=level:asc`
      )
      .pipe(map((res: any) => res.organisationUnitLevels || []));
  }
}
