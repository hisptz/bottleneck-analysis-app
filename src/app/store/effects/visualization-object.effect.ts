import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {VisualizationObjectService} from '../../dashboard/providers/visualization-object.service';
import { MERGE_VISUALIZATION_OBJECT_ACTION, SPLIT_VISUALIZATION_OBJECT_ACTION,
  UpdateVisualizationObjectWithRenderingObjectAction, VISUALIZATION_OBJECT_LAYOUT_CHANGE_ACTION,
  VisualizationObjectMergedAction,
  VisualizationObjectSplitedAction
} from '../actions';
import * as fromAction from '../actions';
import {ChartService} from '../../dashboard/providers/chart.service';
import {GeoFeatureService} from '../../dashboard/providers/geo-feature.service';
import {MapService} from '../../dashboard/providers/map.service';
import {TableService} from '../../dashboard/providers/table.service';
import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
import {updateVisualizationWithAnalytics} from '../handlers/updateVisualizationWithAnalytics';
import {Visualization} from '../../dashboard/model/visualization';
import {mapFavoriteToLayerSettings} from '../reducers/store-data-reducer';
import 'rxjs/add/operator/take';
@Injectable()
export class VisualizationObjectEffect {
  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private visualizationObjectService: VisualizationObjectService,
    private chartService: ChartService,
    private geoFeatureService: GeoFeatureService,
    private mapService: MapService,
    private tableService: TableService
  ) {}

  @Effect({dispatch: false}) loadedVisualizationObject$: Observable<Action> = this.actions$
    .ofType(fromAction.INITIAL_VISUALIZATION_OBJECTS_LOADED_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]: [any, ApplicationState]) => {
      action.payload.forEach((visualizationObject: Visualization) => {
        const visualizationDetails: any = {...visualizationObject.details};

        if (visualizationDetails && visualizationDetails.favorite && visualizationDetails.favorite.id) {
          this.store.dispatch(new fromAction.LoadFavoriteAction({
            apiRootUrl: store.uiState.systemInfo.apiRootUrl,
            visualizationObject: visualizationObject
          }))
        }
      });
      return Observable.of(null)
    });

  @Effect() visualizationWithMapSettings$ = this.actions$
    .ofType(fromAction.UPDATE_VISUALIZATION_WITH_MAP_SETTINGS)
    .withLatestFrom(this.store)
    .flatMap(([action, store]: [any, ApplicationState]) => this.visualizationObjectService.updateVisualizationWithMapSettings(
      store.uiState.systemInfo.apiRootUrl,
      action.payload
    )).map((visualization: Visualization) => new fromAction.SaveVisualization(visualization));

}
