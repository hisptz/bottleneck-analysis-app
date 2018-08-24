import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  getAllGroupDashboards,
  getCurrentDashboardId,
  SetCurrentDashboardAction,
  SetActiveDashboardGroupsAction,
  getAllDashboardGroups,
  getActiveDashboardGroup,
  ToggleDashboardBookmarkAction,
  CreateDashboardAction,
  InitializeDashboardSettingsAction,
  State,
  getDashboardObjectLoading,
  getDashboardObjectLoaded
} from '../../../store';
import { Dashboard, DashboardGroups } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  dashboards$: Observable<Dashboard[]>;
  currentDashboardId$: Observable<string>;
  currentDashboardGroupId$: Observable<string>;
  menuContainerHeight: number;
  dashboardLoading$: Observable<boolean>;
  dashboardLoaded$: Observable<boolean>;
  dashboardGroups$: Observable<DashboardGroups[]>;

  constructor(private store: Store<State>) {
    // initialize dashboads settings
    store.dispatch(new InitializeDashboardSettingsAction());

    this.dashboards$ = store.select(getAllGroupDashboards);
    this.currentDashboardId$ = store.select(getCurrentDashboardId);
    this.dashboardLoading$ = store.select(getDashboardObjectLoading);
    this.dashboardLoaded$ = store.select(getDashboardObjectLoaded);
    this.dashboardGroups$ = store.select(getAllDashboardGroups);
    this.currentDashboardGroupId$ = store.select(getActiveDashboardGroup);

    // menu container height in pixels
    this.menuContainerHeight = 91;
  }

  // Get dashboard content margin top by adding additional height from menu container height
  get dashboardContentMarginTop(): number {
    return this.menuContainerHeight + 60;
  }

  ngOnInit() {}

  onSetCurrenDashboardAction(dashboardId: string) {
    this.store.dispatch(new SetCurrentDashboardAction(dashboardId));
  }

  onSetActiveDashboardGroupAction(group: DashboardGroups) {
    this.store.dispatch(new SetActiveDashboardGroupsAction(group));
  }

  onCreateDashboardAction(dashboardName: string) {
    this.store.dispatch(new CreateDashboardAction(dashboardName));
  }

  onToggleDashboardBookmark(dashboardDetails: { id: string; supportBookmark: boolean; bookmarked: boolean }) {
    this.store.dispatch(
      new ToggleDashboardBookmarkAction(dashboardDetails.id, dashboardDetails.supportBookmark, {
        bookmarked: dashboardDetails.bookmarked,
        bookmarkPending: true
      })
    );
  }
}
