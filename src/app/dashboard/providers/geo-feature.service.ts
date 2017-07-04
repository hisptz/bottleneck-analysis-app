import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {visualizationObjectsSelector} from '../../store/selectors/visualization-objects.selector';
import {HttpClientService} from '../../providers/http-client.service';
import * as _ from 'lodash';

@Injectable()
export class GeoFeatureService {

  constructor(private http: HttpClientService) { }

  getGeoFeature(visualizationDetails: any) {
    const apiRootUrl = visualizationDetails.apiRootUrl;
    const visualizationFilters = visualizationDetails.visualizationObject.details.filters;
    const geoFeatureParametersArray = this._getGeoFeatureParametersArray(visualizationFilters.map(filterObject => { return _.find(filterObject.filters, ['name', 'ou'])}));
    return Observable.create(observer => {
      if (geoFeatureParametersArray === []) {
        observer.next(visualizationDetails);
        observer.complete();
      } else {
        Observable.forkJoin(
          geoFeatureParametersArray.map(geoFeatureParam => {
            return geoFeatureParam !== '' ? this.http.get(this._getGeoFeatureUrl(apiRootUrl, geoFeatureParam)) : Observable.of([])
          })
        )
          .subscribe(geoFeatures => {
            const newGeoFeatures = [];
            visualizationFilters.forEach((filterObject, filterIndex) => {
              newGeoFeatures.push({
                id: filterObject.id,
                content: geoFeatures[filterIndex]
              })
            });
            visualizationDetails.geoFeatures = newGeoFeatures;
            observer.next(visualizationDetails);
            observer.complete();
          }, error => observer.error(error))
      }
    })
  }
  private _getGeoFeatureParametersArray(visualizationOrgUnitArray) {
    return visualizationOrgUnitArray.map(orgUnitObject => { return orgUnitObject.value !== '' ? 'ou=ou:' + orgUnitObject.value : ''});
  }

  private _getGeoFeatureUrl(apiRootUrl: string, geoFeatureParams: string) {
    return apiRootUrl + 'geoFeatures.json?' + geoFeatureParams + '&displayProperty=NAME&includeGroupSets=true';
  }

}
