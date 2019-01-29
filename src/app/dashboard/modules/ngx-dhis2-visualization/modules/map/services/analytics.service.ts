import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getMapAnalytics(dimension: string[], filters: string[]): Observable<any> {
    const url = [].concat.apply([], [dimension, filters]).join('&');
    return this.httpClient.get(`analytics.json?${url}&displayProperty=NAME`);
  }

  getAnalytics(dimensions: string): Observable<any> {
    return this.httpClient.get(
      `analytics.json?${dimensions}&displayProperty=NAME`
    );
  }

  getEventsAnalytics(dimensions: string): Observable<any> {
    return this.httpClient.get(`analytics${dimensions}&coordinatesOnly=true`);
  }

  getEventInformation(eventId): Observable<any> {
    return this.httpClient.get(`events/${eventId}.json'`);
  }
}
