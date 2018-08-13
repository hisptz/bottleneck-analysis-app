import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Dashboard } from '../../models';
import {
  getCurrentUser,
  State,
  getCurrentDashboardVisualizations,
  getCurrentDashboard,
  ToggleDashboardBookmarkAction,
  ManageDashboardItemAction,
  AddNewUnsavedFavoriteAction,
  SetCurrentVisualizationAction,
  GlobalFilterChangeAction
} from '../../../store';
import { User, SystemInfo } from '../../../models';
import { getSystemInfo } from '../../../store/selectors/system-info.selectors';
import { Visualization } from '../../modules/ngx-dhis2-visualization/models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-current-dashboard',
  templateUrl: './current-dashboard.component.html',
  styleUrls: ['./current-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardComponent implements OnInit {
  currentDashboardVisualizations$: Observable<Array<string>>;
  currentDashboard$: Observable<Dashboard>;
  currentUser$: Observable<User>;
  systemInfo$: Observable<SystemInfo>;

  constructor(private store: Store<State>) {
    this.currentDashboardVisualizations$ = store.select(
      getCurrentDashboardVisualizations
    );

    this.currentDashboard$ = store.select(getCurrentDashboard);
    this.currentUser$ = store.select(getCurrentUser);
    this.systemInfo$ = store.select(getSystemInfo);
  }

  ngOnInit() {}

  onToggleCurrentDashboardBookmark(dashboardDetails: {
    id: string;
    supportBookmark: boolean;
    bookmarked: boolean;
  }) {
    this.store.dispatch(
      new ToggleDashboardBookmarkAction(
        dashboardDetails.id,
        dashboardDetails.supportBookmark,
        {
          bookmarked: dashboardDetails.bookmarked,
          bookmarkPending: true
        }
      )
    );
  }

  onAddDashboardItem(dashboardFavoriteDetails: {
    dashboardId: string;
    dashboardItem: any;
  }) {
    this.store.dispatch(
      new ManageDashboardItemAction(
        dashboardFavoriteDetails.dashboardId,
        dashboardFavoriteDetails.dashboardItem,
        'ADD'
      )
    );
  }

  onCreateFavoriteForCurrentDashboard(dashboardId: string) {
    this.store.dispatch(new AddNewUnsavedFavoriteAction(dashboardId));
  }

  onToggleVisualizationFullScreen(fullScreenDetails) {
    this.store.dispatch(
      new SetCurrentVisualizationAction(
        fullScreenDetails.id,
        fullScreenDetails.dashboardId
      )
    );
  }

  onGlobalFilterChange(globalFilterDetails: any) {
    this.store.dispatch(
      new GlobalFilterChangeAction(globalFilterDetails.id, {
        globalSelections: globalFilterDetails.globalSelections
      })
    );
  }

  onDeleteVisualizationAction(visualization: Visualization) {
    this.currentDashboard$.pipe(take(1)).subscribe((dashboard: Dashboard) => {
      this.store.dispatch(
        new ManageDashboardItemAction(
          dashboard.id,
          { id: visualization.id },
          'DELETE'
        )
      );
    });
  }
}
