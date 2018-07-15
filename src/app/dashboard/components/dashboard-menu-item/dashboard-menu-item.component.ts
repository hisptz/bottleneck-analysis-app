import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Dashboard } from '../../models';

import { BOOKMARKED_ICON } from '../../../icons';

@Component({
  selector: 'app-dashboard-menu-item',
  templateUrl: './dashboard-menu-item.component.html',
  styleUrls: ['./dashboard-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMenuItemComponent implements OnInit {
  @Input() dashboardMenuItem: Dashboard;
  @Input() currentDashboardId: string;
  @Output() setDashboard: EventEmitter<string> = new EventEmitter<string>();

  unBookmarkedIcon: string;
  bookmarkedIcon: string;
  constructor() {
    this.bookmarkedIcon = BOOKMARKED_ICON;
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
    console.log('bookmark toggle');
  }
}
