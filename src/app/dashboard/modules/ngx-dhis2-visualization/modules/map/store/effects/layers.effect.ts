import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as layersActions from '../actions/layers.action';
import * as fromServices from '../../services';

@Injectable()
export class LayersEffects {
  constructor(private actions$: Actions, private layerService: fromServices.LayerService) {}

  @Effect()
  createLayers$ = this.actions$.pipe(
    ofType(layersActions.CREATE_LAYERS),
    map((action: layersActions.CreateLayers) => new layersActions.LoadLayersSuccess(action.payload)),
    catchError(error => of(new layersActions.LoadLayersFail(error)))
  );
}
