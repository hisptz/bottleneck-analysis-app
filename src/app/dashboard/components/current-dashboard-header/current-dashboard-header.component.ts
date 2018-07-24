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
import { Observable } from 'rxjs';
import { User } from '../../../models';

@Component({
  selector: 'app-current-dashboard-header',
  templateUrl: './current-dashboard-header.component.html',
  styleUrls: ['./current-dashboard-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardHeaderComponent implements OnInit {
  @Input() currentDashboard: Dashboard;
  @Input() currentUser: User;

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
  constructor() {}

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
      dashboardItem: {
        id: '',
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
    });
  }
}
