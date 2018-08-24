import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoadLegendSets,
  LoadLegendSetSuccess,
  LoadLegendSetFail,
  LegendSetActionTypes,
  LegendSetActions
} from '../actions/legend-set.action';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { LegendSetService } from '../../services';

@Injectable()
export class LegendSetEffects {
  constructor(private actions$: Actions, private legendSetService: LegendSetService) {}

  @Effect()
  loadLegendSets$: Observable<Action> = this.actions$.pipe(
    ofType<LegendSetActions>(LegendSetActionTypes.LoadLegendSets),
    mergeMap(() => this.legendSetService.getLegendSets()),
    map(legendSets => new LoadLegendSetSuccess(legendSets)),
    catchError(error => of(new LoadLegendSetFail(error)))
  );

  @Effect()
  init$: Observable<Action> = defer(() => {
    return of(new LoadLegendSets());
  });
}
