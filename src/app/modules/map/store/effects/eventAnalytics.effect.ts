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
import { getBboxBounds } from '../../utils/layers';

@Injectable()
export class EventAnalyticsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private analyticsService: fromServices.AnalyticsService
  ) {}

  @Effect({ dispatch: false })
  checkEventCounts$ = this.actions$.ofType(visualizationObjectActions.CHECK_EVENT_COUNTS).pipe(
    map((action: visualizationObjectActions.CheckEventCounts) => {
      const layerIds = [];
      const { layers } = action.payload;
      const layersParams = layers.map(layer => {
        const requestParams = [
          ...layer.dataSelections.rows,
          ...layer.dataSelections.columns,
          ...layer.dataSelections.filters
        ];
        layerIds.push(layer.id);
        const dimensions = [];

        requestParams.map(param => {
          const dimension = `dimension=${param.dimension}`;
          if (param.items.length) {
            dimensions.push(
              `${dimension}:${param.items.map(item => item.dimensionItem).join(';')}`
            );
          } else {
            if (param.dimension !== 'dx' && param.dimension !== 'pe') {
              dimensions.push(dimension);
            }
          }
        });
        let url = `${layer.dataSelections.program.id}.json?stage=${
          layer.dataSelections.programStage.id
        }&${dimensions.join('&')}`;
        if (layer.dataSelections.endDate) {
          url += `&endDate=${layer.dataSelections.endDate.split('T')[0]}`;
        }
        if (layer.dataSelections.startDate) {
          url += `&startDate=${layer.dataSelections.startDate.split('T')[0]}`;
        }
        return { countUrl: `/events/count/${url}`, url };
      });
      const sources = layersParams.map(param =>
        this.analyticsService.getEventsAnalytics(param.countUrl)
      );
      Observable.combineLatest(sources).subscribe(layercounts => {
        layercounts.map((layercount, index) => {
          const layer = layers[index];
          const count = layercount['count'];
          const spatialSupport = localStorage.getItem('spatialSupport');
          if (layer.layerOptions.eventClustering && count > 2000 && spatialSupport) {
            const payload = {
              layer: layer,
              count,
              bounds: getBboxBounds(layercount['extent']),
              url: layersParams[index].url,
              visualizationObject: action.payload
            };
            this.store.dispatch(new visualizationObjectActions.AddServerSideClustering(payload));
          } else {
            // clientSide clustering
          }
        });
      });
    })
  );
}
