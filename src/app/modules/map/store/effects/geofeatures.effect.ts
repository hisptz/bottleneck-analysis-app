import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';
import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as fromServices from '../../services';
import { tap } from 'rxjs/operators/tap';
import { map, switchMap, catchError, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Injectable()
export class GeofeatureEffects {
  constructor(
    private actions$: Actions,
    private geofeatureService: fromServices.GeoFeatureService
  ) {}

  @Effect()
  createVisualizationObjet$ = this.actions$
    .ofType(visualizationObjectActions.LOAD_VIZ_OBJ_GEOFEATURE)
    .pipe(
      switchMap((action: visualizationObjectActions.LoadVizObjectGeoFeature) => {
        const parameters = action.payload.layers.map(layer => {
          const isFacility = layer.type === 'facility';
          if (layer.type === 'external') {
            return;
          }
          const requestParams = [...layer.dataSelections.rows, ...layer.dataSelections.columns];
          const data = requestParams.filter(dimension => dimension.dimension === 'ou');
          const parameter = data
            .map((param, paramIndex) => {
              return `ou=${param.dimension}:${param.items.map(item => item.id).join(';')}`;
            })
            .join('&');
          return isFacility
            ? `${parameter}&displayProperty=SHORTNAME&includeGroupSets=true`
            : `${parameter}&displayProperty=NAME`;
        });
        const sources = parameters.map(param => {
          if (param) {
            this.geofeatureService.getGeoFeatures(param);
          }
        });
        const newSource = sources[0] ? sources : Observable.create([]);
        return Observable.combineLatest(sources).pipe(
          map(geofeature => {
            let entity = {};
            action.payload.layers.forEach((layer, index) => {
              entity = {
                ...entity,
                [layer.id]: geofeature[index]
              };
            });
            const geofeatures = {
              ...action.payload.geofeatures,
              ...entity
            };
            const vizObject = {
              ...action.payload,
              geofeatures
            };
            return new visualizationObjectActions.CreateVisualizationObjectSuccess(vizObject);
          }),
          catchError(error =>
            of(new visualizationObjectActions.CreateVisualizationObjectFail(error))
          )
        );
      })
    );
}
