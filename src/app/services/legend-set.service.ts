import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { NgxDhis2HttpClientService } from '@hisptz/ngx-dhis2-http-client';
import { map } from 'rxjs/operators';
import { LegendSet } from '../models/legend-set.model';

@Injectable({ providedIn: 'root' })
export class LegendSetService {
  constructor(private http: NgxDhis2HttpClientService) {}

  getLegendSets(): Observable<LegendSet[]> {
    const legendUrl = `legendSets.json?fields=id,displayName~rename(name),
    legends[id,displayName~rename(name),startValue,endValue,color]&paging=false`;
    return this.http
      .get(legendUrl)
      .pipe(map((legenSetResponse: any) => legenSetResponse.legendSets || []));
  }
}
