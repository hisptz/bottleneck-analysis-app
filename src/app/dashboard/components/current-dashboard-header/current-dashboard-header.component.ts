import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { generateUid } from '../../../helpers/generate-uid.helper';
import { Dashboard } from '../../models';
import { SelectionFilterConfig } from '../../modules/ngx-dhis2-data-selection-filter/models/selected-filter-config.model';
import { VisualizationDataSelection } from '../../modules/ngx-dhis2-visualization/models';
import { DashboardDeleteDialogComponent } from '../dashboard-delete-dialog/dashboard-delete-dialog.component';
import { User } from '@iapps/ngx-dhis2-http-client';

@Component({
  selector: 'app-current-dashboard-header',
  templateUrl: './current-dashboard-header.component.html',
  styleUrls: ['./current-dashboard-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardHeaderComponent implements OnInit {
  @Input() currentDashboard: Dashboard;
  @Input() currentUser: User;
  @Input() currentUserHasAuthorities: boolean;
  @Input() dashboardLoading: boolean;
  @Input() dashboardLoaded: boolean;
  @Input() globalDataSelections: VisualizationDataSelection[];
  @Input() globalDataSelectionSummary: string;
  @Input() visualizationLoadingPercent: number;

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

  @Output()
  resetDashboard: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dialog: MatDialog) {
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

  onOpenDashboardDeleteDialog(e) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(DashboardDeleteDialogComponent, {
      data: this.currentDashboard.name,
      height: '180px',
      width: '500px',
      disableClose: true
    });

    dialogRef.beforeClose().subscribe((action: string) => {
      if (action === 'DELETE') {
        this.onDeleteDashboard();
      }
    });
  }

  onDeleteDashboard() {
    this.deleteDashboard.emit(this.currentDashboard);
  }

  onSaveDashboard(e) {
    e.stopPropagation();
    this.saveDashboard.emit(this.currentDashboard);
  }

  onResetChanges(e) {
    e.stopPropagation();
    this.resetDashboard.emit(this.currentDashboard.id);
  }
}
