import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';

import { VisualizationDataSelection } from '../models';
import { getAnalyticsUrl } from '../helpers';
import { mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: NgxDhis2HttpClientService) {}

  getAnalytics(
    dataSelections: VisualizationDataSelection[],
    layerType: string,
    config?: any
  ): Observable<any> {
    const analyticsUrl = !layerType
      ? getAnalyticsUrl(dataSelections, 'thematic', config)
      : layerType === 'thematic' || layerType === 'event'
        ? getAnalyticsUrl(dataSelections, layerType, config)
        : '';
    return analyticsUrl !== ''
      ? this.http.get(analyticsUrl).pipe(
          mergeMap(
            (analytics: any) =>
              analytics.count && analytics.count < 2000
                ? this.http.get(
                    getAnalyticsUrl(dataSelections, layerType, {
                      ...config,
                      eventClustering: false
                    })
                  )
                : of(analytics)
          )
        )
      : of(null);
  }
}
