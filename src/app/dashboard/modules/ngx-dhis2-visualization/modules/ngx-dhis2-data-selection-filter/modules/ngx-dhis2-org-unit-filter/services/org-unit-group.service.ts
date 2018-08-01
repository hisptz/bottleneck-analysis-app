import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { OrgUnitGroup } from '../models';

@Injectable({ providedIn: 'root' })
export class OrgUnitGroupService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadAll(): Observable<OrgUnitGroup> {
    return this.httpClient
      .get(`organisationUnitGroups.json?fields=id,name&paging=false`)
      .pipe(map((res: any) => res.organisationUnitGroups || []));
  }
}
