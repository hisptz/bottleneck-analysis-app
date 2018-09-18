import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoadLegendSets,
  LoadLegendSetSuccess,
  LoadLegendSetFail,
  LegendSetActionTypes,
  LegendSetActions
} from '../actions/legend-set.action';
import {
  map,
  catchError,
  mergeMap,
  withLatestFrom,
  switchMap
} from 'rxjs/operators';
import { LegendSetService } from '../../services';
import { State } from '../reducers';
import { getAllLegendSets } from '../selectors';

@Injectable()
export class LegendSetEffects {
  constructor(
    private actions$: Actions,
    private legendSetService: LegendSetService,
    private store$: Store<State>
  ) {}

  @Effect()
  loadLegendSets$: Observable<Action> = this.actions$.pipe(
    ofType<LegendSetActions>(LegendSetActionTypes.LoadLegendSets),
    mergeMap(() => this.legendSetService.getLegendSets()),
    map(legendSets => new LoadLegendSetSuccess(legendSets)),
    catchError(error => of(new LoadLegendSetFail(error)))
  );

  @Effect({ dispatch: false })
  upsertLegendSets$: Observable<any> = this.actions$.pipe(
    ofType(LegendSetActionTypes.UpsetLagendSets),
    withLatestFrom(this.store$.select(getAllLegendSets)),
    switchMap(([action, LegendSets]) =>
      this.legendSetService.updateLegendSets(LegendSets)
    ),
    catchError(error => of(new LoadLegendSetFail(error)))
  );

  @Effect()
  init$: Observable<Action> = defer(() => {
    return of(new LoadLegendSets());
  });
}
