import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import {
  loadRootCauseDataIds,
  addRootCauseDataIds
} from '../actions/root-cause-data.actions';
import { mergeMap, map } from 'rxjs/operators';
import { RootCauseDataService } from 'src/app/services/root-cause-data.service';
import { Action } from '@ngrx/store';

@Injectable()
export class RootCauseDataEffects implements OnInitEffects {
  loadRootCauseData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRootCauseDataIds),
      mergeMap(() =>
        this.rootCauseDataService
          .getIds()
          .pipe(
            map((rootCauseDataIds: string[]) =>
              addRootCauseDataIds({ rootCauseDataIds })
            )
          )
      )
    )
  );

  ngrxOnInitEffects(): Action {
    return loadRootCauseDataIds();
  }

  constructor(
    private actions$: Actions,
    private rootCauseDataService: RootCauseDataService
  ) {}
}
