import { AppState } from './../../../../../store/app.reducers';
import { Dashboard } from './../../../../../store/dashboard/dashboard.state';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromDashboardActions from '../../../../../store/dashboard/dashboard.actions';

@Component({
  selector: 'app-current-dashboard-bookmark-button',
  templateUrl: './current-dashboard-bookmark-button.component.html',
  styleUrls: ['./current-dashboard-bookmark-button.component.css']
})
export class CurrentDashboardBookmarkButtonComponent implements OnInit {
  @Input() currentDashboard: Dashboard;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  bookmarkDashboard(e) {
    e.stopPropagation();

    this.store.dispatch(
      new fromDashboardActions.BookmarkDashboardAction({
        dashboardId: this.currentDashboard.id,
        bookmarked: !this.currentDashboard.details.bookmarked
      })
    );
  }
}
