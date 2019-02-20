import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

// root state
import { State } from '../../../store/reducers';

// selectors
import * as fromRootSelectors from '../../../store/selectors';
import * as fromDashboardSelectors from '../../store/selectors';

// actions
import * as fromDashboardActions from '../../store/actions';

// models
import { Dashboard } from '../../models';
import { User, SystemInfo, LegendSet } from '../../../models';

// constant
import {
  WELCOMING_DESCRIPTION,
  WELCOMING_TITLE,
  EMPTY_VISUALIZATION
} from '../../constants/welcoming-messages.constants';
import { getCurrentUserManagementAuthoritiesStatus } from '../../../store/selectors';
import { getCurrentDashboardVisualizationLoadingProgress } from '../../store/selectors';

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
  dashboardNotification$: Observable<any>;
  currentUser$: Observable<User>;
  systemInfo$: Observable<SystemInfo>;
  dashboardLoading$: Observable<boolean>;
  dashboardLoaded$: Observable<boolean>;
  visualizationsReady$: Observable<boolean>;
  legendSets$: Observable<LegendSet[]>;

  currentGlobalDataSelections$: Observable<any>;
  currentGlobalDataSelectionSummary$: Observable<string>;

  currentUserHasManagementAuthorities$: Observable<boolean>;

  progressMessages$: Observable<any>;

  welcomingTitle: string;
  welcomingDescription: string;
  emptyVisualizationMessage: string;

  constructor(private store: Store<State>) {
    this.currentDashboardVisualizationItems$ = store.select(
      fromDashboardSelectors.getCurrentDashboardVisualizationItems
    );

    this.currentDashboardVisualizationLoading$ = store.select(
      fromDashboardSelectors.getCurrentDashboardVisualizationLoading
    );

    this.currentDashboardVisualizationLoaded$ = store.select(
      fromDashboardSelectors.getCurrentDashboardVisualizationLoaded
    );

    this.dashboardNotification$ = store.select(
      fromDashboardSelectors.getDashboardNotification
    );

    this.currentDashboard$ = store.select(
      fromDashboardSelectors.getCurrentDashboard
    );
    this.currentUser$ = store.select(fromRootSelectors.getCurrentUser);
    this.systemInfo$ = store.select(fromRootSelectors.getSystemInfo);
    this.dashboardLoading$ = store.select(
      fromDashboardSelectors.getDashboardLoading
    );
    this.dashboardLoaded$ = store.select(
      fromDashboardSelectors.getDashboardLoaded
    );
    this.visualizationsReady$ = store.select(
      fromDashboardSelectors.getVisualizationReady
    );
    this.legendSets$ = store.select(fromRootSelectors.getAllLegendSets);

    this.currentUserHasManagementAuthorities$ = store.select(
      getCurrentUserManagementAuthoritiesStatus
    );

    this.currentGlobalDataSelections$ = store.select(
      fromDashboardSelectors.getCurrentGlobalDataSelections(false)
    );

    this.currentGlobalDataSelectionSummary$ = store.select(
      fromDashboardSelectors.getGlobalDataSelectionSummary
    );

    this.progressMessages$ = this.store.select(
      getCurrentDashboardVisualizationLoadingProgress
    );

    this.welcomingTitle = WELCOMING_TITLE;
    this.welcomingDescription = WELCOMING_DESCRIPTION;
    this.emptyVisualizationMessage = EMPTY_VISUALIZATION;
  }

  ngOnInit() {}

  onToggleCurrentDashboardBookmark(dashboardDetails: {
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

  onAddDashboardItem(dashboardFavoriteDetails: {
    dashboardId: string;
    dashboardItem: any;
  }) {
    this.store.dispatch(
      new fromDashboardActions.ManageDashboardItemAction(
        dashboardFavoriteDetails.dashboardId,
        dashboardFavoriteDetails.dashboardItem,
        'ADD'
      )
    );
  }

  onCreateFavoriteForCurrentDashboard(dashboardId: string) {
    this.store.dispatch(
      new fromDashboardActions.AddNewUnsavedFavoriteAction(dashboardId)
    );
  }

  onToggleVisualizationFullScreen(fullScreenDetails) {
    this.store.dispatch(
      new fromDashboardActions.SetCurrentVisualizationAction(
        fullScreenDetails.id,
        fullScreenDetails.dashboardId
      )
    );
  }

  onGlobalFilterChange(globalFilterDetails: any) {
    this.store.dispatch(
      new fromDashboardActions.GlobalFilterChangeAction(
        globalFilterDetails.id,
        {
          globalSelections: globalFilterDetails.globalSelections,
          unSaved: true
        }
      )
    );
  }

  onDeleteVisualizationAction(visualizationDetails: any) {
    this.currentDashboard$.pipe(take(1)).subscribe((dashboard: Dashboard) => {
      this.store.dispatch(
        new fromDashboardActions.ManageDashboardItemAction(
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

  onToggleDeleteDialog(currentDashboard: Dashboard) {
    this.store.dispatch(
      new fromDashboardActions.UpdateDashboardAction(currentDashboard.id, {
        showDeleteDialog: !currentDashboard.showDeleteDialog
      })
    );
  }

  onDeleteDashboard(currentDashboard: Dashboard) {
    this.store.dispatch(
      new fromDashboardActions.DeleteDashboard(currentDashboard)
    );
  }

  onSaveDashboard(currentDashboard: Dashboard) {
    this.store.dispatch(
      new fromDashboardActions.SaveDashboardAction(currentDashboard)
    );
  }

  onResetDashboard(dashboardId) {
    this.store.dispatch(
      new fromDashboardActions.ResetDashboardAction(dashboardId, {
        unSaved: false
      })
    );
  }

  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Is it OK?');

    return of(confirmation);
  }
}
