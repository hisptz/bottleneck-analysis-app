import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, combineLatest } from 'rxjs';

import { GeoFeature } from '../models/geo-feature.model';

@Injectable()
export class GeoFeatureService {
  constructor(private httpClient: HttpClientService) {}

  getGeoFeaturesArray(params) {
    const requests = params.map(param => {
      const url = `../../api/geoFeatures.json?${param}`;
      return this.httpClient.get(url);
    });

    return combineLatest(requests);
  }

  getGeoFeatures(param): Observable<GeoFeature[]> {
    const url = `../../api/geoFeatures.json?${param}`;
    return this.httpClient.get(url);
  }
}
