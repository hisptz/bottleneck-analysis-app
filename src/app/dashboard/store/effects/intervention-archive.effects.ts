import { Actions, createEffect, ofType } from '@ngrx/effects';
import { State, getCurrentUser } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { InterventionArchiveService } from '../../services/intervention-archive.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import {
  InterventionArchiveAction,
  archiveInterventionSuccess,
  archiveInterventionFail,
} from '../actions/intervention-archive.actions';
import {
  concatMap,
  withLatestFrom,
  mergeMap,
  map,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';
import * as _ from 'lodash';
import { User } from '@iapps/ngx-dhis2-http-client';
import { DASHBOARD_ATTRIBUTE_TO_OMIT } from '../../constants/dashboard-attributes-to-omit.constant';

@Injectable()
export class InterventionArchiveEffects {
  archiveIntervention$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InterventionArchiveAction.ArchiveIntervention),
      concatMap((action) =>
        of(action).pipe(withLatestFrom(this.store.pipe(select(getCurrentUser))))
      ),
      mergeMap(([action, currentUser]: [any, User]) => {
        const { intervention, visualizationLayers } = action;
        this.snackBar.open(`Archiving ${intervention.name} intervention....`);
        const chartVisualizationLayer = _.find(visualizationLayers, [
          'visualizationType',
          'CHART',
        ]);
        const selectionObject = { pe: '', ou: '' };

        (chartVisualizationLayer
          ? chartVisualizationLayer.dataSelections
          : []
        ).forEach((selection: any) => {
          if (selection.dimension === 'dx') {
            return undefined;
          }
          selectionObject[selection.dimension] = selection.items
            .map((item) => item.id)
            .join(';');
        });

        const date = new Date();

        const interventionArchive = {
          id: `${intervention.id}_${selectionObject.ou}_${selectionObject.pe}`,
          created: date.toISOString(),
          lastUpdated: date.toISOString(),
          intervention: _.omit(intervention, DASHBOARD_ATTRIBUTE_TO_OMIT),
          visualizationLayers,
          user: { id: currentUser.id },
        };

        return this.interventionArchiveService.save(interventionArchive).pipe(
          map(() => {
            this.snackBar.open(
              `${intervention.name} intervention archived successfully`,
              'OK',
              {
                duration: 3000,
              }
            );
            return archiveInterventionSuccess({
              interventionArchive,
            });
          }),
          catchError((error) => {
            this.snackBar.open(
              `Fail to archive ${intervention.name} intervention, Error (Code: ${error.status}): ${error.message}`,
              'OK'
            );
            return of(archiveInterventionFail({ error }));
          })
        );
      })
    )
  );
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private interventionArchiveService: InterventionArchiveService,
    private snackBar: MatSnackBar
  ) {}
}
