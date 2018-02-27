import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { tap, map, switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as dataSelectionAction from '../actions/data-selection.action';
import * as layersActions from '../actions/layers.action';
import * as fromServices from '../../services';
import * as fromStore from '../../store';
import { getDimensionItems } from '../../utils/analytics';

@Injectable()
export class EventAnalyticsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private analyticsService: fromServices.AnalyticsService
  ) {}

  @Effect({ dispatch: false })
  checkEventCounts$ = this.actions$.ofType(visualizationObjectActions.CHECK_EVENT_COUNTS).pipe(
    tap((action: visualizationObjectActions.CheckEventCounts) => {
      const layerIds = [];
      const { layers } = action.payload;
      const layersParams = layers.map(layer => {
        const requestParams = [
          ...layer.dataSelections.rows,
          ...layer.dataSelections.columns,
          ...layer.dataSelections.filters
        ];
        layerIds.push(layer.id);
        const ous = getDimensionItems('ou', requestParams);
        const ousUrl = `ou:${ous.map(item => item.dimensionItem).join(';')}`;
        let url = `/events/count/${layer.dataSelections.program.id}.json?stage=${
          layer.dataSelections.programStage.id
        }&${ousUrl}`;
        if (layer.dataSelections.endDate) {
          url += `&endDate=${layer.dataSelections.endDate.split('T')[0]}`;
        }
        if (layer.dataSelections.startDate) {
          url += `&startDate=${layer.dataSelections.startDate.split('T')[0]}`;
        }
        return url;
      });
      console.log(layersParams);
      const sources = layersParams.map(param => this.analyticsService.getEventsAnalytics(param));
      // Observable.combineLatest(sources).subscribe(values => console.log(values));
    })
  );
}
