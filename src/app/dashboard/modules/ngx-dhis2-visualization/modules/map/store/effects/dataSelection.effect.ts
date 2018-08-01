import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as dataSelectionAction from '../actions/data-selection.action';
import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as fromServices from '../../services';
import { tap, map, switchMap, catchError, combineLatest } from 'rxjs/operators';

@Injectable()
export class DataSelectionEffects {
  constructor(private actions$: Actions, private geofeatureService: fromServices.GeoFeatureService) {}

  @Effect({ dispatch: false })
  updatePe$ = this.actions$.ofType(dataSelectionAction.UPDATE_PE_SELECTION).pipe(
    map((action: dataSelectionAction.UpdatePESelection) => {
      const payload = action.payload;
    }),
    catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
  );

  @Effect({ dispatch: false })
  updateDx$ = this.actions$.ofType(dataSelectionAction.UPDATE_DX_SELECTION).pipe(
    map((action: dataSelectionAction.UpdateDXSelection) => {
      const payload = action.payload;
    }),
    catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
  );

  @Effect()
  updateOu$ = this.actions$.ofType(dataSelectionAction.UPDATE_OU_SELECTION).pipe(
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
