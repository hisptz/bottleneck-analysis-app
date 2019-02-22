import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import * as baseLayerAction from '../actions/base-layer.action';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class BaseLayerEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  addBaseLayer$ = this.actions$.pipe(
    ofType(baseLayerAction.ADD_BASELAYER),
    map((action: baseLayerAction.AddBaseLayer) => new baseLayerAction.AddBaseLayerSuccess(action.payload)),
    catchError(error => of(new baseLayerAction.AddBaseLayerFail(error)))
  );

  @Effect()
  updateBaseLayer$ = this.actions$.pipe(
    ofType(baseLayerAction.UPDATE_BASELAYER),
    map((action: baseLayerAction.UpdateBaseLayer) => new baseLayerAction.UpdateBaseLayerSuccess(action.payload)),
    catchError(error => of(new baseLayerAction.UpdateBaseLayerFail(error)))
  );
}
