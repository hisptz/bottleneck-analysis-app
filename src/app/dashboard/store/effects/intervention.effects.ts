import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { InterventionService } from '../../services/intervention.service';
import { Observable } from 'rxjs';

import * as fromInterventionActions from '../actions/intervention.actions';
import { switchMap, map } from 'rxjs/operators';

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
  constructor(
    private actions$: Actions,
    private interventionService: InterventionService
  ) {}
}
