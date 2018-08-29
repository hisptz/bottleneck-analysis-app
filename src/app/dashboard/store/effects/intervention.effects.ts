import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { InterventionService } from '../../services/intervention.service';
import { Observable, of } from 'rxjs';

import * as fromInterventionActions from '../actions/intervention.actions';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class InterventionEffects {
  @Effect()
  loadInterventions$: Observable<any> = this.actions$.pipe(
    ofType(fromInterventionActions.InterventionActionTypes.LoadInterventions),
    switchMap(() =>
      this.interventionService
        .getInterventions()
        .pipe(
          map(
            (interventions: any[]) =>
              new fromInterventionActions.AddInterventions(interventions)
          )
        )
    )
  );

  @Effect()
  createInterventation$: Observable<any> = this.actions$.pipe(
    ofType(fromInterventionActions.InterventionActionTypes.CreateIntervention),
    mergeMap((action: fromInterventionActions.CreateIntervention) =>
      this.interventionService.createIntervention(action.intervention).pipe(
        map(
          () =>
            new fromInterventionActions.CreateInterventionSuccess(
              action.intervention
            )
        ),
        catchError((error: any) =>
          of(
            new fromInterventionActions.CreateInterventionFail(
              action.intervention,
              error
            )
          )
        )
      )
    )
  );

  @Effect()
  saveIntervention$: Observable<any> = this.actions$.pipe(
    ofType(fromInterventionActions.InterventionActionTypes.SaveIntervention),
    mergeMap((action: fromInterventionActions.SaveIntervention) =>
      this.interventionService.updateIntervention(action.intervention).pipe(
        map(
          () =>
            new fromInterventionActions.SaveInterventionSuccess(
              action.intervention
            )
        ),
        catchError((error: any) =>
          of(
            new fromInterventionActions.SaveInterventionFail(
              action.intervention,
              error
            )
          )
        )
      )
    )
  );

  @Effect()
  deleteIntervention$: Observable<any> = this.actions$.pipe(
    ofType(fromInterventionActions.InterventionActionTypes.DeleteIntervention),
    mergeMap((action: fromInterventionActions.DeleteIntervention) =>
      this.interventionService.deleteIntervention(action.intervention.id).pipe(
        map(
          () =>
            new fromInterventionActions.DeleteInterventionSuccess(
              action.intervention.id
            )
        ),
        catchError((error: any) =>
          of(
            new fromInterventionActions.DeleteInterventionFail(
              action.intervention,
              error
            )
          )
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private interventionService: InterventionService
  ) {}
}
