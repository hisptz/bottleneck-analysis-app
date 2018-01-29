import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import { GeoFeature } from '../models/geo-feature.model';

@Injectable()
export class GeoFeatureService {
  constructor(private httpClient: HttpClient) {}

  getGeoFeatures(param): Observable<GeoFeature[]> {
    const url = `../../../api/geoFeatures.json?${param}`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
}
