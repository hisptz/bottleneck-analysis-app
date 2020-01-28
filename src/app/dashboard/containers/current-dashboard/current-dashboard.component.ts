import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { take, first } from 'rxjs/operators';

// root state
import { State } from '../../../store/reducers';

// selectors
import * as fromRootSelectors from '../../../store/selectors';
import * as fromDashboardSelectors from '../../store/selectors';

// actions
import * as fromDashboardActions from '../../store/actions';

// models
import { Dashboard } from '../../models';
import { SystemInfo, LegendSet } from '../../../models';

// constant
import {
  WELCOMING_DESCRIPTION,
  WELCOMING_TITLE,
  EMPTY_VISUALIZATION,
} from '../../constants/welcoming-messages.constants';
import { getCurrentUserManagementAuthoritiesStatus } from '../../../store/selectors';
import {
  getCurrentDashboardVisualizationLoadingProgress,
  getDashboardMenuHeight,
} from '../../store/selectors';
import { User } from '@iapps/ngx-dhis2-http-client';
import { VisualizationDataSelection } from '../../modules/ngx-dhis2-visualization/models';
import {
  getCurrentGlobalDataSelections,
  getGlobalDataSelectionSummary,
} from '../../store/selectors/data-selections.selectors';

@Component({
  selector: 'app-current-dashboard',
  templateUrl: './current-dashboard.component.html',
  styleUrls: ['./current-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  menuContainerHeight$: Observable<number>;

  currentGlobalDataSelections$: Observable<any>;
  currentGlobalDataSelectionSummary$: Observable<string>;

  currentUserHasManagementAuthorities$: Observable<boolean>;

  progressMessages$: Observable<any>;

  welcomingTitle: string;
  welcomingDescription: string;
  emptyVisualizationMessage: string;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.currentDashboardVisualizationItems$ = this.store.select(
      fromDashboardSelectors.getCurrentDashboardVisualizationItems
    );

    this.currentDashboardVisualizationLoading$ = this.store.select(
      fromDashboardSelectors.getCurrentDashboardVisualizationLoading
    );

    this.currentDashboardVisualizationLoaded$ = this.store.select(
      fromDashboardSelectors.getCurrentDashboardVisualizationLoaded
    );

    this.dashboardNotification$ = this.store.select(
      fromDashboardSelectors.getDashboardNotification
    );

    this.currentDashboard$ = this.store.select(
      fromDashboardSelectors.getCurrentDashboard
    );
    this.currentUser$ = this.store.select(fromRootSelectors.getCurrentUser);
    this.systemInfo$ = this.store.select(fromRootSelectors.getSystemInfo);
    this.dashboardLoading$ = this.store.select(
      fromDashboardSelectors.getDashboardLoading
    );
    this.dashboardLoaded$ = this.store.select(
      fromDashboardSelectors.getDashboardLoaded
    );
    this.visualizationsReady$ = this.store.select(
      fromDashboardSelectors.getVisualizationReady
    );
    this.legendSets$ = this.store.select(fromRootSelectors.getAllLegendSets);

    this.currentUserHasManagementAuthorities$ = this.store.select(
      getCurrentUserManagementAuthoritiesStatus
    );

    this.currentGlobalDataSelections$ = this.store.select(
      getCurrentGlobalDataSelections(false)
    );

    this.currentGlobalDataSelectionSummary$ = this.store.select(
      getGlobalDataSelectionSummary
    );

    this.progressMessages$ = this.store.select(
      getCurrentDashboardVisualizationLoadingProgress
    );

    this.menuContainerHeight$ = this.store.select(getDashboardMenuHeight);

    this.welcomingTitle = WELCOMING_TITLE;
    this.welcomingDescription = WELCOMING_DESCRIPTION;
    this.emptyVisualizationMessage = EMPTY_VISUALIZATION;
  }

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
            bookmarkPending: true,
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
          unSaved: true,
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
            isNew: visualizationDetails.visualization.isNew,
          },
          'DELETE'
        )
      );
    });
  }

  onToggleDeleteDialog(currentDashboard: Dashboard) {
    this.store.dispatch(
      new fromDashboardActions.UpdateDashboardAction(currentDashboard.id, {
        showDeleteDialog: !currentDashboard.showDeleteDialog,
      })
    );
  }

  onDeleteDashboard(currentDashboard: Dashboard) {
    this.store.dispatch(
      new fromDashboardActions.DeleteDashboard(currentDashboard)
    );
  }

  onSaveDashboard() {
    this.currentDashboard$
      .pipe(take(1))
      .subscribe((currentDashboard: Dashboard) => {
        this.store.dispatch(
          new fromDashboardActions.SaveDashboardAction(currentDashboard)
        );
      });
  }

  onResetDashboard(dashboardId) {
    this.store.dispatch(
      new fromDashboardActions.ResetDashboardAction(dashboardId, {
        unSaved: false,
      })
    );
  }

  onDashboardSharingUpdate({ sharingDetails, currentDashboard }) {
    this.store.dispatch(
      new fromDashboardActions.UpdateDashboardAction(
        currentDashboard.id,
        sharingDetails
      )
    );
  }

  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Is it OK?');

    return of(confirmation);
  }
}
