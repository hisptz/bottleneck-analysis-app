import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { HttpClientService } from './http-client.service';
import { LegendSet, Legend } from '../models/legendSet-config.model';
import { AppConfigurationsService } from './app-configurations.service';

@Injectable({ providedIn: 'root' })
export class LegendSetService {
  constructor(private http: HttpClientService, private appConfigurationService: AppConfigurationsService) {}

  // @todo update url to data store
  getLegendSets(): Observable<LegendSet[]> {
    const legendUrl = `../../api/userDataStore/legendSets/configuration`;
    return new Observable(observer => {
      this.http.get(legendUrl).subscribe(
        (response: any) => {
          const legendSets = response.legendSets || [];
          observer.next(this.getSanitizedLegendSets(legendSets));
          observer.complete();
        },
        () => {
          this.appConfigurationService.getDefaultLegends().subscribe(legendSets => {
            observer.next(this.getSanitizedLegendSets(legendSets));
            observer.complete();
          });
        }
      );
    });
  }

  getSanitizedLegendSets(legendSets: LegendSet[]) {
    legendSets.forEach((legendSet: LegendSet) => {
      legendSet.legends.forEach((legend: Legend) => {
        legend.startValue = !legend.startValue ? Number.NEGATIVE_INFINITY : legend.startValue;
        legend.endValue = !legend.endValue ? Number.POSITIVE_INFINITY : legend.endValue;
      });
    });
    return legendSets;
  }

  updateLegendSets(legendSets: LegendSet[]): Observable<any> {
    const legendUrl = `../../api/userDataStore/legendSets/configuration`;
    const filteredLegendSets = _.filter(legendSets, (legendSet: LegendSet) => legendSet.legends.length > 0);
    return this.http.put(legendUrl, { legendSets: filteredLegendSets });
  }
}
