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
  BOOKMARKED_ICON,
  BOOKMARK_PENDING_ICON,
  UN_BOOKMARKED_ICON
} from '../../../icons';
import { openAnimation } from '../../../animations';

@Component({
  selector: 'app-dashboard-menu-item',
  templateUrl: './dashboard-menu-item.component.html',
  styleUrls: ['./dashboard-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [openAnimation]
})
export class DashboardMenuItemComponent implements OnInit {
  @Input() dashboardMenuItem: Dashboard;
  @Input() currentDashboardId: string;
  @Output() setDashboard: EventEmitter<string> = new EventEmitter<string>();
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
    this.bookmarkedIcon = BOOKMARKED_ICON;
    this.bookmarkPendingIcon = BOOKMARK_PENDING_ICON;
    this.unBookmarkedIcon = UN_BOOKMARKED_ICON;
    this.showBookmarkButton = false;
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
