import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Dashboard } from '../../models';

import {
  BOOKMARK_PENDING_ICON,
  UN_BOOKMARKED_ICON,
  BOOKMARKED_SELECTED_ICON
} from '../../../icons';
import { openAnimation } from '../../../animations';
import { VisualizationDataSelection } from '../../modules/ngx-dhis2-visualization/models';
import { dashboardHasRootCauseData } from '../../helpers/dashboard-has-root-cause-data.helper';

@Component({
  selector: 'app-dashboard-menu-item',
  templateUrl: './dashboard-menu-item.component.html',
  styleUrls: ['./dashboard-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [openAnimation]
})
export class DashboardMenuItemComponent implements OnInit {
  @Input()
  dashboardMenuItem: Dashboard;
  @Input()
  currentDashboardId: string;
  @Input() dataSelections: VisualizationDataSelection[];
  @Input() rootCauseDataIds: string[];
  @Output()
  setDashboard: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  toggleDashboardMenuItemBookmark: EventEmitter<{
    id: string;
    bookmarked: boolean;
    supportBookmark: boolean;
  }> = new EventEmitter();

  showBookmarkButton: boolean;

  unBookmarkedIcon: string;
  bookmarkPendingIcon: string;
  bookmarkedIcon: string;
  constructor() {
    this.bookmarkedIcon = BOOKMARKED_SELECTED_ICON;
    this.bookmarkPendingIcon = BOOKMARK_PENDING_ICON;
    this.unBookmarkedIcon = UN_BOOKMARKED_ICON;
    this.showBookmarkButton = false;
  }

  get hasRootCauseData(): boolean {
    return dashboardHasRootCauseData(
      this.dataSelections || [],
      this.dashboardMenuItem ? this.dashboardMenuItem.id : '',
      this.rootCauseDataIds || []
    );
  }

  get dashboardItemDescription(): string {
    if (!this.dashboardMenuItem) {
      return '';
    }

    return `${
      this.dashboardMenuItem.unSaved
        ? 'This intervention contains unsaved changes'
        : this.dashboardMenuItem.name
    }${
      this.hasRootCauseData
        ? '(This intervention has root cause data for selected period and organisation unit)'
        : ''
    }`;
  }
  ngOnInit() {}

  onSetDashboard(e) {
    e.stopPropagation();
    if (this.currentDashboardId !== this.dashboardMenuItem.id) {
      this.setDashboard.emit(this.dashboardMenuItem.id);
    }
  }

  onToggleBookmark(e) {
    e.stopPropagation();
    this.toggleDashboardMenuItemBookmark.emit({
      id: this.dashboardMenuItem.id,
      bookmarked: !this.dashboardMenuItem.bookmarked,
      supportBookmark: this.dashboardMenuItem.supportBookmark
    });
  }

  onHover(e) {
    e.stopPropagation();
    this.showBookmarkButton = true;
  }

  onBlur(e) {
    e.stopPropagation();
    this.showBookmarkButton = false;
  }
}
