import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { InterventionArchive } from '../models/intervention-archive.model';

@Injectable({ providedIn: 'root' })
export class DashboardArchiveService {
  private dataStoreNamespace = 'dataStore/intervention-archives';
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  save(interventionArchive: InterventionArchive, action: string) {
    return action === 'CREATE'
      ? this.httpClient.post(
          `${this.dataStoreNamespace}/${interventionArchive.id}`,
          interventionArchive
        )
      : this.httpClient.put(
          `${this.dataStoreNamespace}/${interventionArchive.id}`,
          interventionArchive
        );
  }

  findOne(id: string) {
    return this.httpClient.get(`${this.dataStoreNamespace}/${id}`);
  }
}
