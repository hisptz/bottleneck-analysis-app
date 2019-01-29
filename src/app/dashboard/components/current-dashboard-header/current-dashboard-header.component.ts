import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import * as _ from 'lodash';
import { Dashboard } from '../../models';
import { User } from '../../../models';
import { SelectionFilterConfig } from '../../modules/ngx-dhis2-data-selection-filter/models/selected-filter-config.model';
import { generateUid } from '../../../helpers/generate-uid.helper';
import { VisualizationDataSelection } from '../../modules/ngx-dhis2-visualization/models';

@Component({
  selector: 'app-current-dashboard-header',
  templateUrl: './current-dashboard-header.component.html',
  styleUrls: ['./current-dashboard-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardHeaderComponent implements OnInit {
  @Input()
  currentDashboard: Dashboard;
  @Input()
  currentUser: User;

  @Input()
  currentUserHasAuthorities: boolean;

  @Input()
  dashboardLoading: boolean;

  @Input()
  dashboardLoaded: boolean;

  @Input()
  globalDataSelections: VisualizationDataSelection[];

  selectionFilterConfig: SelectionFilterConfig;
  showFavoriteFilter: boolean;

  @Output()
  toggleCurrentDashboardBookmark: EventEmitter<{
    id: string;
    supportBookmark: boolean;
    bookmarked: boolean;
  }> = new EventEmitter();

  @Output()
  addDashboardItem: EventEmitter<{
    dashboardId: string;
    dashboardItem: {
      id: string;
      [favoriteType: string]: any;
    };
  }> = new EventEmitter<{
    dashboardId: string;
    dashboardItem: {
      id: string;
      [favoriteType: string]: any;
    };
  }>();

  @Output()
  createFavoriteForCurrentDashboard: EventEmitter<string> = new EventEmitter<
    string
  >();

  @Output()
  globalFilterChange: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  toggleDashboardDeleteDialog: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  deleteDashboard: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  saveDashboard: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.selectionFilterConfig = {
      showLayout: false
    };
  }

  ngOnInit() {}

  onToggleDashboardBookmarkAction(dashboardBookmarked: boolean) {
    this.toggleCurrentDashboardBookmark.emit({
      id: this.currentDashboard.id,
      supportBookmark: this.currentDashboard.supportBookmark,
      bookmarked: dashboardBookmarked
    });
  }

  onAddFavoriteAction(favorite: {
    id: string;
    name: string;
    dashboardTypeDetails: any;
  }) {
    this.addDashboardItem.emit({
      dashboardId: this.currentDashboard.id,
      dashboardItem:
        favorite.dashboardTypeDetails.type !== 'APP'
          ? {
              id: generateUid(),
              type: favorite.dashboardTypeDetails.type,
              [_.camelCase(favorite.dashboardTypeDetails.type)]: favorite
                .dashboardTypeDetails.isArray
                ? [
                    {
                      id: favorite.id,
                      name: favorite.name
                    }
                  ]
                : {
                    id: favorite.id,
                    name: favorite.name
                  }
            }
          : {
              id: generateUid(),
              type: favorite.dashboardTypeDetails.type,
              appKey: favorite.id
            }
    });
  }

  onCreateFavoriteAction() {
    if (this.currentDashboard) {
      this.createFavoriteForCurrentDashboard.emit(this.currentDashboard.id);
    }
  }

  onFilterUpdateAction(dataSelections: any[]) {
    this.globalFilterChange.emit({
      id: this.currentDashboard.id,
      globalSelections: dataSelections
    });
  }

  onToggleDashboardDeleteDialog(e) {
    e.stopPropagation();
    this.toggleDashboardDeleteDialog.emit(this.currentDashboard);
  }

  onDeleteDashboard(e) {
    e.stopPropagation();
    this.deleteDashboard.emit(this.currentDashboard);
  }

  onSaveDashboard() {
    this.saveDashboard.emit(this.currentDashboard);
  }
}
