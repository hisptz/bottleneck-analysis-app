import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
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
import { User, SystemInfo, DataGroup } from '../../../models';
import { getCurrentUserManagementAuthoritiesStatus } from '../../../store/selectors';

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
  currentUser$: Observable<User>;
  systemInfo$: Observable<SystemInfo>;
  dataGroups$: Observable<DataGroup[]>;
  currentUserHasManagementAuthorities$: Observable<boolean>;
  unSavedDashboardsExist: boolean;

  @HostListener('window:beforeunload')
  unloadAppToSave() {
    if (!this.unSavedDashboardsExist) {
      return true;
    }

    const confirmation = window.confirm('Is it OK?');

    return confirmation;
  }

  constructor(private store: Store<State>) {
    // initialize dashboads settings
    store.dispatch(
      new fromDashboardActions.InitializeDashboardSettingsAction()
    );

    this.dashboards$ = store.select(
      fromDashboardSelectors.getAllGroupDashboards
    );
    this.currentDashboardId$ = store.select(
      fromDashboardSelectors.getCurrentDashboardId
    );
    this.dashboardLoading$ = store.select(
      fromDashboardSelectors.getDashboardLoading
    );
    this.dashboardLoaded$ = store.select(
      fromDashboardSelectors.getDashboardLoaded
    );
    this.dashboardGroups$ = store.select(
      fromDashboardSelectors.getAllDashboardGroups
    );
    this.currentDashboardGroupId$ = store.select(
      fromDashboardSelectors.getActiveDashboardGroup
    );
    this.currentUser$ = store.select(fromRootSelectors.getCurrentUser);
    this.systemInfo$ = store.select(fromRootSelectors.getSystemInfo);
    this.dataGroups$ = store.select(fromRootSelectors.getDataGroups);

    this.currentUserHasManagementAuthorities$ = store.select(
      getCurrentUserManagementAuthoritiesStatus
    );

    this.store
      .select(fromDashboardSelectors.checkIfUnSavedDashboardsExist)
      .subscribe((unSavedDashboardsExist: boolean) => {
        this.unSavedDashboardsExist = unSavedDashboardsExist;
      });

    // menu container height in pixels
    this.menuContainerHeight = 60;
  }

  // Get dashboard content margin top by adding additional height from menu container height
  get dashboardContentMarginTop(): number {
    return this.menuContainerHeight + 60;
  }

  ngOnInit() {}

  onSetCurrenDashboardAction(dashboardId: string) {
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
}
