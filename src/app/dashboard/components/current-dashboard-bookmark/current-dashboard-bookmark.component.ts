import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { UN_BOOKMARKED_ICON, BOOKMARKED_ICON } from '../../../icons';

@Component({
  selector: 'app-current-dashboard-bookmark',
  templateUrl: './current-dashboard-bookmark.component.html',
  styleUrls: ['./current-dashboard-bookmark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardBookmarkComponent implements OnInit {
  @Input() dashboardBookmarked: boolean;
  unBookmarkedIcon: string;
  bookmarkedIcon: string;
  constructor() {
    this.unBookmarkedIcon = UN_BOOKMARKED_ICON;
    this.bookmarkedIcon = BOOKMARKED_ICON;
  }

  ngOnInit() {}
}
