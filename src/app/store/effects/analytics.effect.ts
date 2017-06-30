import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {AnalyticsService} from '../../dashboard/providers/analytics.service';
import {
  AnalyticsLoadedAction, LOAD_ANALYTICS_ACTION, LoadAnalyticsAction, UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION,
  UPDATE_VISUALIZATION_WITH_FILTER_ACTION
} from '../actions';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
@Injectable()
export class AnalyticsEffect {
  constructor(
    private actions$: Actions,
    private analyticsService: AnalyticsService
  ) {}

  @Effect() loadedVisualizationObjectWithFavorite$: Observable<Action> = this.actions$
    .ofType(UPDATE_VISUALIZATION_WITH_FILTER_ACTION)
    .flatMap((action: any) => Observable.of(action.payload))
    .map(visualizationObject => new LoadAnalyticsAction(visualizationObject));

  @Effect() loadedVisualizationObjectWithFilters$: Observable<Action> = this.actions$
    .ofType(UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION)
    .flatMap((action: any) => Observable.of(action.payload))
    .map(visualizationObject => new LoadAnalyticsAction(visualizationObject));

  @Effect() visualizationObjectWithAnalytics$: Observable<Action> = this.actions$
    .ofType(LOAD_ANALYTICS_ACTION)
    .flatMap((action: any) => this.analyticsService.getAnalytics(action.payload))
    .map(payload => new AnalyticsLoadedAction(payload));
}
