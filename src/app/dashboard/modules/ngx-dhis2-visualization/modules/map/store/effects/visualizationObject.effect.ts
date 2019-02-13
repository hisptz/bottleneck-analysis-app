import { of, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import * as visualizationObjectActions from '../actions/visualization-object.action';
import * as legendSetActions from '../actions/legend-set.action';
import * as layerActions from '../actions/layers.action';
import * as fromServices from '../../services';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import { toGeoJson, getPeriodFromFilters } from '../../utils';
import { timeFormat } from 'd3-time-format';

@Injectable()
export class VisualizationObjectEffects {
  public program: string;
  private programStage: string;

  constructor(
    private actions$: Actions,
    private store: Store<fromStore.MapState>,
    private geofeatureService: fromServices.GeoFeatureService,
    private analyticsService: fromServices.AnalyticsService,
    private systemService: fromServices.SystemService
  ) {}
  @Effect()
  createVisualizationObjet$ = this.actions$.pipe(
    ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT),
    map(
      (action: visualizationObjectActions.CreateVisualizationObject) =>
        new visualizationObjectActions.CreateVisualizationObjectSuccess(action.payload)
    ),
    catchError(error => of(new visualizationObjectActions.CreateVisualizationObjectFail(error)))
  );

  @Effect()
  updateStyleVisualizationObjet$ = this.actions$.pipe(
    ofType(layerActions.UPDATE_LAYER_STYLE),
    map(
      (action: visualizationObjectActions.UpdateVisualizationObject) =>
        new visualizationObjectActions.UpdateVisualizationObjectSuccess(action.payload)
    ),
    catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
  );

  @Effect({ dispatch: false })
  dispatchCreateAnalytics$ = this.actions$.pipe(
    ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS),
    map((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
      const layers = action.payload.layers;
      const needsAnalytics = layers.filter(layer => layer && (layer.type === 'event' || layer.type === 'thematic'));

      if (needsAnalytics.length) {
        this.store.dispatch(new visualizationObjectActions.LoadAnalyticsVizObj(action.payload));
      }
    })
  );

  @Effect({ dispatch: false })
  dispatchAddOrgUnitGroupSet$ = this.actions$.pipe(
    ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS),
    tap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
      const layers = action.payload.layers;
      const needsOrgUnitGroupSet = layers.filter(layer => layer && layer.dataSelections.organisationUnitGroupSet);
      if (needsOrgUnitGroupSet.length) {
        this.store.dispatch(new visualizationObjectActions.AddOrgUnitGroupSetVizObj(action.payload));
      }
    })
  );

  @Effect({ dispatch: false })
  dispatchAddLegendSetSet$ = this.actions$.pipe(
    ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS),
    tap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
      const layers = action.payload.layers;
      const needsLegendSets = layers.filter(layer => layer && layer.dataSelections.legendSet);
      if (needsLegendSets.length) {
        this.store.dispatch(new legendSetActions.LoadLegendSet(action.payload));
      }
    })
  );

  @Effect({ dispatch: false })
  dispatchCreateGeoFeatures$ = this.actions$.pipe(
    ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT_SUCCESS),
    tap((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => {
      const { layers } = action.payload;
      const entities = this.getParameterEntities(layers);
      const values = Object.keys(entities).map(key => entities[key]);
      this.geofeatureService.getGeoFeaturesArray(values).pipe(map(geofeature => console.log(geofeature)));
    })
  );

  @Effect()
  dispatchAddGeoFeatures$ = this.actions$.pipe(
    ofType(visualizationObjectActions.CREATE_VISUALIZATION_OBJECT),
    map((action: visualizationObjectActions.CreateVisualizationObjectSuccess) => action.payload),
    switchMap(vizObject => {
      const { layers } = vizObject;
      const entities = this.getParameterEntities(layers);
      const values = Object.keys(entities).map(key => entities[key]);
      return this.geofeatureService.getGeoFeaturesArray(values).pipe(
        map(geofeature => {
          const geofeatures = Object.keys(entities).reduce((arr = {}, key, index) => {
            return { ...arr, [key]: geofeature[index] };
          }, {});
          return new visualizationObjectActions.AddGeoFeaturesVizObj({
            ...vizObject,
            geofeatures
          });
        }),
        catchError(error => of(new visualizationObjectActions.AddVisualizationObjectCompleteFail(error)))
      );
    })
  );

  @Effect()
  dispatchAddGeoFeaturescomplete$ = this.actions$.pipe(
    ofType(visualizationObjectActions.ADD_VISUALIZATION_OBJECT_COMPLETE),
    switchMap((action: visualizationObjectActions.AddVisualizationObjectComplete) => {
      const vizObject = action.payload;
      const { layers } = vizObject;
      const _layers = layers.map(layer => {
        const { layerOptions } = layer;
        if (layerOptions.serverClustering) {
          const url = this.getEventLayerUrl(layer);
          const { dataSelections } = layer;
          this.program = dataSelections.program && dataSelections.program.displayName;
          this.programStage = dataSelections.programStage && dataSelections.programStage.displayName;
          const load = (params, callback) => {
            const serverSide = `/events/cluster/${url}&clusterSize=${params.clusterSize}&bbox=${
              params.bbox
            }&coordinatesOnly=true&includeClusterPoints=${params.includeClusterPoints}`;
            this.analyticsService
              .getEventsAnalytics(serverSide)
              .subscribe(data => callback(params.tileId, toGeoJson(data)));
          };
          const popup = this.onEventClick.bind(this);
          const serverSideConfig = { ...layerOptions.serverSideConfig, load, popup };
          const _layerOptions = { ...layerOptions, serverSideConfig };
          return { ...layer, layerOptions: _layerOptions };
        }
        if (layer.type === 'earthEngine') {
          const accessToken = callback => this.systemService.getGoogleEarthToken().subscribe(json => callback(json));
          const earthEngineConfig = { ...layerOptions.earthEngineConfig, accessToken };
          const _layerOptions = { ...layerOptions, earthEngineConfig };
          return { ...layer, layerOptions: _layerOptions };
        }
        return layer;
      });

      const entities = this.getParameterEntities(layers);
      const parameters = Object.keys(entities).map(key => entities[key]);
      const sources = parameters.length
        ? parameters.map(param => {
            return this.geofeatureService.getGeoFeatures(param);
          })
        : of([]);
      return forkJoin(sources).pipe(
        map(geofeature => {
          const geofeatures = Object.keys(entities).reduce((arr = {}, key, index) => {
            return { ...arr, [key]: geofeature[index] };
          }, {});
          return new visualizationObjectActions.AddVisualizationObjectCompleteSuccess({
            ...vizObject,
            layers: _layers,
            geofeatures
          });
        }),
        catchError(error => of(new visualizationObjectActions.UpdateVisualizationObjectFail(error)))
      );
    })
  );

  getParameterEntities(layers: Layer[]) {
    let globalEntities = {};
    layers.reduce((entities = {}, layer, index) => {
      const { rows, columns, filters } = layer.dataSelections;
      const isFacility = layer.type === 'facility';
      if (layer.type === 'external' || layer.type === 'earthEngine') {
        return;
      }
      const requestParams = [...rows, ...columns, ...filters];
      const data = requestParams.filter(dimension => dimension.dimension === 'ou');
      const parameter = data
        .map((param, paramIndex) => {
          return `ou=${param.dimension}:${param.items.map(item => item.id || item.dimensionItem).join(';')}`;
        })
        .join('&');
      const url = isFacility
        ? `${parameter}&displayProperty=SHORTNAME&includeGroupSets=true`
        : `${parameter}&displayProperty=NAME`;
      const entity = { [layer.id]: url };

      globalEntities = { ...globalEntities, ...entity };
      return { ...entities, ...entity };
    }, {});
    return globalEntities;
  }

  private onEventClick(event) {
    const layer = event.layer;
    const feature = layer._feature;
    const coord = feature.geometry.coordinates;
    this.analyticsService.getEventInformation(feature.id).subscribe(data => {
      const { orgUnitName, dataValues, eventDate, coordinate } = data;
      const content = `<table><tbody> <tr>
                      <th>Organisation unit: </th><td>${orgUnitName}</td></tr>
                    <tr><th>Event time: </th>
                      <td>${timeFormat('%Y-%m-%d')(new Date(eventDate))}</td>
                    </tr>
                    <tr><th>Program Stage: </th>
                      <td>${this.programStage}</td>
                    </tr>
                    <tr>
                      <th>Event location: </th>
                      <td>${Number(coordinate.latitude).toFixed(6)}, ${Number(coordinate.longitude).toFixed(6)}</td>
                    </tr></tbody></table>`;
      // Close any popup if there is one
      layer.closePopup();
      // Bind new popup to the layer
      layer.bindPopup(content);
      // Open the binded popup
      layer.openPopup();
    });
  }

  private getEventLayerUrl(layer) {
    const requestParams = [
      ...layer.dataSelections.rows,
      ...layer.dataSelections.columns,
      ...layer.dataSelections.filters
    ];
    const period = getPeriodFromFilters(requestParams);
    const dimensions = [];

    requestParams.map(param => {
      const dimension = `dimension=${param.dimension}`;
      if (param.items.length) {
        dimensions.push(`${dimension}:${param.items.map(item => item.dimensionItem).join(';')}`);
      } else {
        if (param.dimension !== 'dx' && param.dimension !== 'pe') {
          dimensions.push(dimension);
        }
      }
    });
    let url = `${layer.dataSelections.program.id}.json?stage=${layer.dataSelections.programStage.id}&${dimensions.join(
      '&'
    )}`;
    if (layer.dataSelections.endDate && !period) {
      url += `&endDate=${layer.dataSelections.endDate.split('T')[0]}`;
    }
    if (layer.dataSelections.startDate && !period) {
      url += `&startDate=${layer.dataSelections.startDate.split('T')[0]}`;
    }
    return url;
  }
}
