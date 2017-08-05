import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {visualizationObjectsSelector} from '../../store/selectors/visualization-objects.selector';
import {HttpClientService} from '../../providers/http-client.service';
import * as _ from 'lodash';
import {FavoriteService} from './favorite.service';

@Injectable()
export class GeoFeatureService {

  constructor(
    private http: HttpClientService,
    private favoriteService: FavoriteService
  ) { }

  getGeoFeature(visualizationDetails: any) {
    const apiRootUrl = visualizationDetails.apiRootUrl;
    // const visualizationFilters = visualizationDetails.visualizationObject.details.filters;
    const visualizationFilters = visualizationDetails.visualizationObject.layers.map(layer => {
      const filterDetails = this.favoriteService.getVisualizationFiltersFromFavorite({favorite: layer.settings});

      let filters = [];
      let newFilter = null;
      if (filterDetails.filters) {
        filters = filterDetails.filters;
        filters.forEach(filter => { newFilter = filter});
      }
      return newFilter;
    });

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
    return visualizationOrgUnitArray.map(orgUnitObject => { return orgUnitObject && orgUnitObject.value !== '' ? 'ou=ou:' + orgUnitObject.value : ''});
  }

  private _getGeoFeatureUrl(apiRootUrl: string, geoFeatureParams: string) {
    return apiRootUrl + 'geoFeatures.json?' + geoFeatureParams + '&displayProperty=NAME&includeGroupSets=true';
  }

}
