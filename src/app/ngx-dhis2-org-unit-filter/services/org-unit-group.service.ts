import { Injectable } from "@angular/core";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { map } from "rxjs/operators";

@Injectable()
export class OrgUnitGroupService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  loadAll() {
    return this.httpClient
      .get(`organisationUnitGroups.json?fields=id,name&paging=false`, {
        useIndexDb: true,
      })
      .pipe(map((res: any) => res.organisationUnitGroups || []));
  }
}
