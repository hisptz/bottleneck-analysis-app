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
  constructor(
    private actions$: Actions,
    private interventionService: InterventionService
  ) {}
}
