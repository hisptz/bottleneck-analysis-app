import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// root state
import { State } from '../../../store/reducers';

// selectors
import * as fromRootSelectors from '../../../store/selectors';
import * as fromDashboardSelectors from '../../store/selectors';

// actions
import * as fromDashboardActions from '../../store/actions';

// models
import { Dashboard, DashboardGroups } from '../../models';
import { SystemInfo, DataGroup } from '../../../models';
import { getCurrentUserManagementAuthoritiesStatus } from '../../../store/selectors';
import {
  getDashboardMenuHeight,
  getDashboardMenuExpanded,
  getDashboardContentMarginTop
} from '../../store/selectors';
import { ChangeDashboardMenuHeight } from '../../store/actions';
import { User } from '@iapps/ngx-dhis2-http-client';

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
  menuContainerHeight$: Observable<number>;
  dashboardContentMarginTop$: Observable<number>;
  dashboardLoading$: Observable<boolean>;
  dashboardLoaded$: Observable<boolean>;
  dashboardGroups$: Observable<DashboardGroups[]>;
  currentUser$: Observable<User>;
  systemInfo$: Observable<SystemInfo>;
  dataGroups$: Observable<DataGroup[]>;
  currentUserHasManagementAuthorities$: Observable<boolean>;
  unSavedDashboardsExist: boolean;
  menuExpanded$: Observable<boolean>;

  @HostListener('window:beforeunload')
  unloadAppToSave() {
    if (!this.unSavedDashboardsExist) {
      return true;
    }

    const confirmation = window.confirm('Is it OK?');

    return confirmation;
  }

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.dispatch(
      new fromDashboardActions.InitializeDashboardSettingsAction()
    );

    this.dashboards$ = this.store.select(
      fromDashboardSelectors.getAllGroupDashboards
    );
    this.currentDashboardId$ = this.store.select(
      fromDashboardSelectors.getCurrentDashboardId
    );
    this.dashboardLoading$ = this.store.select(
      fromDashboardSelectors.getDashboardLoading
    );
    this.dashboardLoaded$ = this.store.select(
      fromDashboardSelectors.getDashboardLoaded
    );
    this.dashboardGroups$ = this.store.select(
      fromDashboardSelectors.getAllDashboardGroups
    );
    this.currentDashboardGroupId$ = this.store.select(
      fromDashboardSelectors.getActiveDashboardGroup
    );
    this.currentUser$ = this.store.select(fromRootSelectors.getCurrentUser);
    this.systemInfo$ = this.store.select(fromRootSelectors.getSystemInfo);
    this.dataGroups$ = this.store.select(fromRootSelectors.getDataGroups);

    this.currentUserHasManagementAuthorities$ = this.store.select(
      getCurrentUserManagementAuthoritiesStatus
    );

    this.menuContainerHeight$ = this.store.select(getDashboardMenuHeight);
    this.menuExpanded$ = this.store.select(getDashboardMenuExpanded);
    this.dashboardContentMarginTop$ = this.store.select(
      getDashboardContentMarginTop
    );

    this.store
      .select(fromDashboardSelectors.checkIfUnSavedDashboardsExist)
      .subscribe((unSavedDashboardsExist: boolean) => {
        this.unSavedDashboardsExist = unSavedDashboardsExist;
      });
  }

  onSetCurrentDashboardAction(dashboardId: string) {
    this.store.dispatch(
      new fromDashboardActions.SetCurrentDashboardAction(dashboardId)
    );
  }

  onSetActiveDashboardGroupAction(group: DashboardGroups) {
    this.store.dispatch(
      new fromDashboardActions.SetActiveDashboardGroupsAction(group)
    );
  }

  onCreateDashboardAction(dashboardDetails: any) {
    this.store.dispatch(
      new fromDashboardActions.CreateDashboardAction(
        dashboardDetails.dashboard,
        dashboardDetails.currentUser,
        dashboardDetails.systemInfo,
        dashboardDetails.dataGroups
      )
    );
  }

  onToggleDashboardBookmark(dashboardDetails: {
    id: string;
    supportBookmark: boolean;
    bookmarked: boolean;
  }) {
    this.currentUser$.pipe(take(1)).subscribe((currentUser: User) => {
      this.store.dispatch(
        new fromDashboardActions.ToggleDashboardBookmarkAction(
          dashboardDetails.id,
          dashboardDetails.supportBookmark,
          {
            bookmarked: dashboardDetails.bookmarked,
            bookmarkPending: true
          },
          currentUser
        )
      );
    });
  }

  onToggleDashboardMenuView(e) {
    e.stopPropagation();

    this.store.dispatch(new ChangeDashboardMenuHeight());
  }
}
