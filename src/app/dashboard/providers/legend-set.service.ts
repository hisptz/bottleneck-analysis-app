import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientService} from '../../providers/http-client.service';

@Injectable()
export class LegendSetService {

  constructor(private http: HttpClientService) { }

  getLegendSet(visualizationDetails: any) {
    const apiRootUrl = visualizationDetails.apiRootUrl;
    const visualizationLayers = visualizationDetails.visualizationObject.layers;
    const legendSetArray = visualizationLayers.map(layer => {return layer.settings.legendSet});
    return Observable.create(observer => {
      Observable.forkJoin(
        legendSetArray.map(legendSet => {
          return legendSet ? this.http.get(this._getLegendSetUrl(apiRootUrl, legendSet.id)) : Observable.of(null)
        })
      ).subscribe(legendSets => {
        visualizationDetails.legendSets = legendSets;
        observer.next(visualizationDetails);
        observer.complete();
        }, error => observer.error(error));
    })
  }

  private _getLegendSetUrl(apiRootUrl, legendSetId) {
    return apiRootUrl + 'legendSets/' + legendSetId + '.json?fields=id,name,legends[id,name,startValue,endValue,color]';
  }

}
