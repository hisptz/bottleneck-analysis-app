import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private httpClient: HttpClientService) {}

  getMapAnalytics(dimension: string[], filters: string[]): Observable<any> {
    const url = [].concat.apply([], [dimension, filters]).join('&');
    return this.httpClient.get(`analytics.json?${url}&displayProperty=NAME`);
  }

  getAnalytics(dimensions: string): Observable<any> {
    return this.httpClient.get(`analytics.json?${dimensions}&displayProperty=NAME`);
  }

  getEventsAnalytics(dimensions: string): Observable<any> {
    return this.httpClient.get(`analytics${dimensions}&coordinatesOnly=true`);
  }

  getEventInformation(eventId): Observable<any> {
    return this.httpClient.get(`events/${eventId}.json'`);
  }

  get(url: string): Observable<any> {
    return this.httpClient.get(url);
  }
}
