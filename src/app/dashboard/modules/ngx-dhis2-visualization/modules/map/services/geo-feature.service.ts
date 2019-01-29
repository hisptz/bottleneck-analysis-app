import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';

import { GeoFeature } from '../models/geo-feature.model';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

@Injectable({ providedIn: 'root' })
export class GeoFeatureService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getGeoFeaturesArray(params) {
    const requests = params.map(param => {
      const url = `geoFeatures.json?${param}`;
      return this.httpClient.get(url);
    });

    return combineLatest(requests);
  }

  getGeoFeatures(param): Observable<GeoFeature[]> {
    const url = `geoFeatures.json?${param}`;
    return this.httpClient.get(url);
  }
}
