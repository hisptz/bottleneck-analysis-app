import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Dashboard } from '../../models';
import {
  getCurrentUser,
  State,
  getCurrentDashboard,
  getAllLegendSets,
  ToggleDashboardBookmarkAction,
  ManageDashboardItemAction,
  AddNewUnsavedFavoriteAction,
  SetCurrentVisualizationAction,
  GlobalFilterChangeAction,
  getDashboardObjectLoading,
  getDashboardObjectLoaded,
  getVisualizationReady,
  getCurrentDashboardVisualizationItems,
  getCurrentDashboardVisualizationLoading,
  getCurrentDashboardVisualizationLoaded
} from '../../../store';
import { User, SystemInfo, LegendSet } from '../../../models';
import { getSystemInfo } from '../../../store/selectors/system-info.selectors';
import { take } from 'rxjs/operators';

import { WELCOMING_DESCRIPTION, WELCOMING_TITLE } from '../../constants/welcoming-messages.constants';

@Component({
  selector: 'app-current-dashboard',
  templateUrl: './current-dashboard.component.html',
  styleUrls: ['./current-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardComponent implements OnInit {
  currentDashboardVisualizationItems$: Observable<any[]>;
  currentDashboardVisualizationLoading$: Observable<boolean>;
  currentDashboardVisualizationLoaded$: Observable<boolean>;
  currentDashboard$: Observable<Dashboard>;
  currentUser$: Observable<User>;
  systemInfo$: Observable<SystemInfo>;
  dashboardLoading$: Observable<boolean>;
  dashboardLoaded$: Observable<boolean>;
  visualizationsReady$: Observable<boolean>;
  legendSets$: Observable<LegendSet[]>;

  welcomingTitle: string;
  welcomingDescription: string;
  emptyVisualizationMessage: string;

  constructor(private store: Store<State>) {
    this.currentDashboardVisualizationItems$ = store.select(getCurrentDashboardVisualizationItems);

    this.currentDashboardVisualizationLoading$ = store.select(getCurrentDashboardVisualizationLoading);

    this.currentDashboardVisualizationLoaded$ = store.select(getCurrentDashboardVisualizationLoaded);

    this.currentDashboard$ = store.select(getCurrentDashboard);
    this.currentUser$ = store.select(getCurrentUser);
    this.systemInfo$ = store.select(getSystemInfo);
    this.dashboardLoading$ = store.select(getDashboardObjectLoading);
    this.dashboardLoaded$ = store.select(getDashboardObjectLoaded);
    this.visualizationsReady$ = store.select(getVisualizationReady);
    this.legendSets$ = store.select(getAllLegendSets);

    this.welcomingTitle = WELCOMING_TITLE;
    this.welcomingDescription = WELCOMING_DESCRIPTION;
    this.emptyVisualizationMessage =
      'There are no items on this dashboard, search for charts, tables, maps and many more and add them to your dashboard';
  }

  ngOnInit() {}

  onToggleCurrentDashboardBookmark(dashboardDetails: { id: string; supportBookmark: boolean; bookmarked: boolean }) {
    this.store.dispatch(
      new ToggleDashboardBookmarkAction(dashboardDetails.id, dashboardDetails.supportBookmark, {
        bookmarked: dashboardDetails.bookmarked,
        bookmarkPending: true
      })
    );
  }

  onAddDashboardItem(dashboardFavoriteDetails: { dashboardId: string; dashboardItem: any }) {
    this.store.dispatch(
      new ManageDashboardItemAction(dashboardFavoriteDetails.dashboardId, dashboardFavoriteDetails.dashboardItem, 'ADD')
    );
  }

  onCreateFavoriteForCurrentDashboard(dashboardId: string) {
    this.store.dispatch(new AddNewUnsavedFavoriteAction(dashboardId));
  }

  onToggleVisualizationFullScreen(fullScreenDetails) {
    this.store.dispatch(new SetCurrentVisualizationAction(fullScreenDetails.id, fullScreenDetails.dashboardId));
  }

  onGlobalFilterChange(globalFilterDetails: any) {
    this.store.dispatch(
      new GlobalFilterChangeAction(globalFilterDetails.id, {
        globalSelections: globalFilterDetails.globalSelections
      })
    );
  }

  onDeleteVisualizationAction(visualizationDetails: any) {
    this.currentDashboard$.pipe(take(1)).subscribe((dashboard: Dashboard) => {
      this.store.dispatch(
        new ManageDashboardItemAction(
          dashboard.id,
          {
            id: visualizationDetails.visualization.id,
            favorite: visualizationDetails.visualization.favorite,
            deleteFavorite: visualizationDetails.deleteFavorite,
            isNew: visualizationDetails.visualization.isNew
          },
          'DELETE'
        )
      );
    });
  }
}
