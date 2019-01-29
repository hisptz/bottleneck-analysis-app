import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  UN_BOOKMARKED_ICON,
  BOOKMARKED_ICON,
  BOOKMARK_PENDING_ICON
} from '../../../icons';

@Component({
  selector: 'app-current-dashboard-bookmark',
  templateUrl: './current-dashboard-bookmark.component.html',
  styleUrls: ['./current-dashboard-bookmark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardBookmarkComponent implements OnInit {
  @Input() dashboardBookmarked: boolean;
  @Input() dashboardBookmarkPending: boolean;
  @Output()
  toggleDashboardBookmark: EventEmitter<boolean> = new EventEmitter<boolean>();
  unBookmarkedIcon: string;
  bookmarkedIcon: string;
  bookmarkPendingIcon: string;
  constructor() {
    this.unBookmarkedIcon = UN_BOOKMARKED_ICON;
    this.bookmarkedIcon = BOOKMARKED_ICON;
    this.bookmarkPendingIcon = BOOKMARK_PENDING_ICON;
  }

  ngOnInit() {}

  onToggleDashboardBookmark(e) {
    e.stopPropagation();
    this.toggleDashboardBookmark.emit(!this.dashboardBookmarked);
  }
}
