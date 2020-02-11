import { combineLatest as observableCombineLatest, of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as dataSelectionAction from '../actions/data-selection.action';
import * as fromServices from '../../services';
import * as fromStore from '../../store';
import { standardizeIncomingAnalytics } from '../../utils/standardize-incoming-analytics';

@Injectable()
export class AnalyticsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private analyticsService: fromServices.AnalyticsService
  ) {}

  @Effect()
  addAnalytics$ = this.actions$.pipe(
    ofType(visualizationObjectActions.LOAD_ANALYTICS),
    switchMap((action: visualizationObjectActions.LoadAnalyticsVizObj) => {
      const layerIds = [];
      const layersParams = action.payload.layers.map(layer => {
        const requestParams = [
          ...layer.dataSelections.rows,
          ...layer.dataSelections.columns,
          ...layer.dataSelections.filters,
        ];
        const noAnalyticsLayers = ['boundary', 'facility', 'external', 'event'];
        const layerName = layer.type;
        if (noAnalyticsLayers.indexOf(layerName) === -1) {
          layerIds.push(layer.id);
          return requestParams
            .map((param, paramIndex) => {
              return `dimension=${param.dimension}:${param.items
                .map(item => item.id)
                .join(';')}`;
            })
            .join('&');
        }

        if (layerName === 'event') {
          layerIds.push(layer.id);
          const data = requestParams
            .map((param, paramIndex) => {
              const dimension = `dimension=${param.dimension}`;
              if (param.items.length) {
                return `${dimension}:${param.items
                  .map(item => item.id)
                  .join(';')}`;
              }
              return dimension;
            })
            .join('&');
          let url = `/events/query/${layer.dataSelections.program.id}.json?stage=${layer.dataSelections.programStage.id}&${data}`;
          if (layer.dataSelections.endDate) {
            url += `&endDate=${layer.dataSelections.endDate.split('T')[0]}`;
          }
          if (layer.dataSelections.startDate) {
            url += `&startDate=${layer.dataSelections.startDate.split('T')[0]}`;
          }
          return url;
        }
      });
      const sources = [];
      layersParams.map(param => {
        if (param) {
          if (param.startsWith('/events')) {
            sources.push(this.analyticsService.getEventsAnalytics(param));
          } else {
            sources.push(this.analyticsService.getAnalytics(param));
          }
        }
      });

      const newSources = sources.length ? sources : Observable.create([]);

      return observableCombineLatest(newSources).pipe(
        map((data, index) => {
          let analytics = {};
          if (data.length) {
            const analyticObj: any = data.reduce((obj, cur, i) => {
              obj[layerIds[i]] = cur;
              return obj;
            }, {});
            analytics = {
              ...action.payload.analytics,
              ...analyticObj,
            };
          }
          const vizObject = {
            ...action.payload,
            analytics,
          };
          return new visualizationObjectActions.UpdateVizAnalytics(vizObject);
        }),
        catchError(error =>
          of(
            new visualizationObjectActions.UpdateVisualizationObjectFail(error)
          )
        )
      );
    })
  );

  @Effect()
  updateOu$ = this.actions$.pipe(
    ofType(
      dataSelectionAction.UPDATE_OU_SELECTION,
      dataSelectionAction.UPDATE_DX_SELECTION,
      dataSelectionAction.UPDATE_PE_SELECTION
    ),
    map((action: dataSelectionAction.UpdateDXSelection) => action.payload),
    switchMap(payload => {
      const { componentId, layer, newdimension } = payload;
      const { url, newLayer } = this.createParams(payload);
      const sources = url ? this.analyticsService.get(url) : of([]);

      return sources.pipe(
        map(
          analytics =>
            new visualizationObjectActions.UpdateFilterAnalytics({
              analytics: {
                [layer.id]: standardizeIncomingAnalytics(analytics, true),
              },
              componentId,
              layer: newLayer,
            })
        ),

        catchError(error =>
          of(
            new visualizationObjectActions.UpdateVisualizationObjectFail(error)
          )
        )
      );
    })
  );

  createParams(payload) {
    const { layer, filterType, newdimension } = payload;
    const { type } = layer;
    const { rows, columns, filters } = layer.dataSelections;
    const d = { rows, columns, filters };

    const _filters: { rows?: any; columns?: any; filters?: any } = Object.keys(
      d
    ).reduce((acc, key) => {
      const dimensions = d[key].map(item =>
        item.dimension === filterType ? { ...newdimension } : item
      );
      acc[key] = dimensions;
      return acc;
    }, {});

    const arrayToObject = (arr, keyField) =>
      Object.assign(
        {},
        ...arr.map(item => ({
          [item[keyField]]: item.items
            .map(_item => _item.dimensionItem || _item.id)
            .join(';'),
        }))
      );
    const dataSelections = { ...layer.dataSelections, ..._filters };

    const filtObj = arrayToObject(
      [..._filters.rows, ..._filters.columns, ..._filters.filters],
      'dimension'
    );

    const paramUrl = ['dx', 'ou', 'pe']
      .map(dimension =>
        filtObj[dimension] && filtObj[dimension] !== ''
          ? `dimension=${dimension}:${filtObj[dimension]}`
          : ''
      )
      .join('&');

    let url = 'analytics';

    if (type === 'event') {
      const { aggregationType, startDate, endDate } = dataSelections;
      if (aggregationType === 'agregate') {
        url += '/events/aggregate/' + this.getProgramParameters(dataSelections);
      } else {
        url += '/events/query/';
        url += this.getProgramParameters(dataSelections);
      }
      if (startDate && endDate) {
        url += 'startDate=' + startDate + '&' + 'endDate=' + endDate + '&';
      }
    } else {
      url += '.json?';
    }
    if (paramUrl !== '') {
      url += paramUrl;
    }
    url += this.getAnalyticsCallStrategies('MAP', type);
    const noAnalyticsLayers = ['boundary', 'facility', 'external'];
    return {
      newLayer: { ...layer, dataSelections },
      url: noAnalyticsLayers.includes(type) ? null : url,
    };
  }

  getAnalyticsCallStrategies(
    visualizationType,
    layerType: string = null
  ): string {
    let strategies = '';
    strategies +=
      visualizationType === 'EVENT_CHART' ||
      visualizationType === 'EVENT_REPORT' ||
      visualizationType === 'EVENT_MAP'
        ? '&outputType=EVENT'
        : '';
    strategies += '&displayProperty=NAME';
    strategies +=
      layerType !== null && layerType === 'event'
        ? '&coordinatesOnly=true'
        : '';
    return strategies;
  }

  getProgramParameters({ program, programStage }): string {
    let params = '';
    if (programStage && programStage) {
      if (program.hasOwnProperty('id') && programStage.hasOwnProperty('id')) {
        params = program.id + '.json?stage=' + programStage.id + '&';
      }
    }
    return params;
  }
}
