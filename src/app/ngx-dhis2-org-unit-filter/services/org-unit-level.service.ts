import { Injectable } from "@angular/core";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { map } from "rxjs/operators";
import * as _ from 'lodash';

@Injectable()
export class OrgUnitLevelService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadAll() {
    return this.httpClient
      .get(
        `organisationUnitLevels.json?fields=id,name,level&paging=false`,
        { useIndexDb: true }
      )
      .pipe(map((res: any) => _.sortBy(res.organisationUnitLevels || [], ['level'])));
  }
}
