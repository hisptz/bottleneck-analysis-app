import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, Observable, interval } from 'rxjs';
import { Store } from '@ngrx/store';
import * as dataSelectionAction from '../actions/data-selection.action';
import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as visualizationLegengActions from '../actions/visualization-legend.action';
import * as fromServices from '../../services';
import { tap, map, switchMap, catchError, combineLatest, take, mapTo } from 'rxjs/operators';

@Injectable()
export class DataSelectionEffects {
  constructor(private actions$: Actions, private geofeatureService: fromServices.GeoFeatureService) {}

  @Effect({ dispatch: false })
  updatePe$ = this.actions$.pipe(
    ofType(dataSelectionAction.UPDATE_PE_SELECTION),
    map((action: dataSelectionAction.UpdatePESelection) => {
      const payload = action.payload;
      // console.log(payload);
    }),
    catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
  );

  @Effect({ dispatch: false })
  updateDx$ = this.actions$.pipe(
    ofType(dataSelectionAction.UPDATE_DX_SELECTION),
    map((action: dataSelectionAction.UpdateDXSelection) => {
      const payload = action.payload;
      // console.log(payload);
    }),
    catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
  );

  @Effect()
  visualizationLegendLoading$ = this.actions$.pipe(
    ofType(
      dataSelectionAction.UPDATE_OU_SELECTION,
      dataSelectionAction.UPDATE_DX_SELECTION,
      dataSelectionAction.UPDATE_PE_SELECTION
    ),
    map(
      (action: dataSelectionAction.UpdateDXSelection) =>
        new visualizationLegengActions.VisualizationLegendFilterSectionLoading(action.payload.componentId)
    ),
    catchError(error => of(new visualizationLegengActions.VisualizationLegendFilterSectionUpdateFail()))
  );

  @Effect()
  visualizationLegendLoaded$ = this.actions$.pipe(
    ofType(visualizationObjectActions.UPDATE_FILTER_ANALYTICS),
    map(
      (action: visualizationObjectActions.UpdateFilterAnalytics) =>
        new visualizationLegengActions.VisualizationLegendFilterSectionLoaded(action.payload.componentId)
    ),
    catchError(error => of(new visualizationLegengActions.VisualizationLegendFilterSectionUpdateFail()))
  );

  @Effect()
  visualizationLegendUpdate$ = this.actions$.pipe(
    ofType(visualizationLegengActions.VISUALIZATION_FILTER_SECTION_LOADED),
    switchMap((action: visualizationLegengActions.VisualizationLegendFilterSectionLoaded) =>
      interval(3000).pipe(
        take(1),
        mapTo({ type: visualizationLegengActions.VISUALIZATION_FILTER_SECTION_JUST_UPDATED, payload: action.payload })
      )
    ),
    catchError(error => of(new visualizationLegengActions.VisualizationLegendFilterSectionUpdateFail()))
  );

  @Effect()
  visualizationLegendFailListener$ = this.actions$.pipe(
    ofType(visualizationObjectActions.UPDATE_VISUALIZATION_OBJECT_FAIL),
    map(
      (action: visualizationObjectActions.UpdateVisualizationObjectFail) =>
        new visualizationLegengActions.VisualizationLegendFilterSectionUpdateFail()
    )
  );

  @Effect()
  updateOu$ = this.actions$.pipe(
    ofType(dataSelectionAction.UPDATE_OU_SELECTION),
    map((action: dataSelectionAction.UpdateDXSelection) => action.payload),
    switchMap(payload => {
      const { componentId, layer, params } = payload;
      const requestParam = `ou=ou:${params}&displayProperty=NAME`;
      return this.geofeatureService.getGeoFeatures(requestParam).pipe(
        map(
          value =>
            new visualizationObjectActions.UpdateGeoFeatureVizObj({
              componentId,
              geofeature: { [layer.id]: value }
            })
        ),
        catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
      );
    })
  );
}
