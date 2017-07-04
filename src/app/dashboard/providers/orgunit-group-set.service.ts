import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientService} from '../../providers/http-client.service';

@Injectable()
export class OrgunitGroupSetService {

  constructor(private http: HttpClientService) { }

  getGroupSet(visualizationDetails: any) {
    const apiRootUrl = visualizationDetails.apiRootUrl;
    const visualizationLayers = visualizationDetails.visualizationObject.layers;
    const groupSetArray = visualizationLayers.map(layer => {return layer.settings.organisationUnitGroupSet});
    return Observable.create(observer => {
      Observable.forkJoin(
        groupSetArray.map(groupSet => {
          return groupSet ? this.http.get(this._getGroupSetUrl(apiRootUrl, groupSet.id)) : Observable.of(null)
        })
      ).subscribe(legendSets => {
        visualizationDetails.groupSets = legendSets;
        observer.next(visualizationDetails);
        observer.complete();
      }, error => observer.error(error));
    })
  }
  private _getGroupSetUrl(apiRootUrl, groupSetId) {
    return apiRootUrl + 'organisationUnitGroupSets/' + groupSetId + '.json?fields=id,name,organisationUnitGroups[id,name,displayName,symbol]';
  }

}
