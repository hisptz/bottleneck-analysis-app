import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as legendSetActions from '../actions/legend-set.action';
import * as fromServices from '../../services';
import * as fromStore from '../../store';
import { tap } from 'rxjs/operators/tap';

@Injectable()
export class VisualizationObjectEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private geofeatureService: fromServices.GeoFeatureService
  ) {}
  @Effect()
  createVisualizationObjet$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT)
    .pipe(
      switchMap((action: visualizationObjectActions.CreateVisualizationObject) => {
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
        const sources = [];
        parameters.map(param => {
          if (param) {
            sources.push(this.geofeatureService.getGeoFeatures(param));
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

  @Effect({ dispatch: false })
  dispatchCreateAnalytics$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
    .pipe(
      map((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
        const layers = action.payload.layers;
        const needsAnalytics = layers.filter(
          layer => layer && (layer.type === 'event' || layer.type === 'thematic')
        );

        if (needsAnalytics.length) {
          this.store.dispatch(new visualizationObjectActions.LoadAnalyticsVizObj(action.payload));
        }
      })
    );

  @Effect({ dispatch: false })
  dispatchAddOrgUnitGroupSet$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
    .pipe(
      tap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
        const layers = action.payload.layers;
        const needsOrgUnitGroupSet = layers.filter(
          layer => layer && layer.dataSelections.organisationUnitGroupSet
        );
        if (needsOrgUnitGroupSet.length) {
          this.store.dispatch(
            new visualizationObjectActions.AddOrgUnitGroupSetVizObj(action.payload)
          );
        }
      })
    );

  @Effect({ dispatch: false })
  dispatchAddLegendSetSet$ = this.actions$
    .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
    .pipe(
      tap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
        const layers = action.payload.layers;
        const needsLegendSets = layers.filter(layer => layer && layer.dataSelections.legendSet);
        if (needsLegendSets.length) {
          this.store.dispatch(new legendSetActions.AddLegendSet(action.payload));
        }
      })
    );

  // @Effect({ dispatch: false })
  // dispatchCreateGeoFeatures$ = this.actions$
  //   .ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS)
  //   .pipe(
  //     tap((action: visualizationObjectActions.CreateVisualizationObject) => {
  //       const layers = action.payload.layers;
  //       // console.log('Is actually Listening:::', layers);
  //     })
  //   );

  @Effect({ dispatch: false })
  dispatchCreateVizObjectComplete$ = this.actions$
    .ofType(visualizationObjectActions.ADD_VISUALIZATION_OBJECT_COMPLETE)
    .pipe(
      tap((action: visualizationObjectActions.AddVisualizationObjectComplete) => {
        const visualizationObject = action.payload;
        // console.log('Is actually Listening:::', visualizationObject);
        this.store.dispatch(
          new visualizationObjectActions.AddVisualizationObjectCompleteSuccess(visualizationObject)
        );
      })
    );
}
