import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/app.reducers';
import {Observable} from 'rxjs/Observable';
import * as fromDashboardSelectors from '../../../../../store/dashboard/dashboard.selectors';
import * as fromDashboardActions from '../../../../../store/dashboard/dashboard.actions';

@Component({
  selector: 'app-dashboard-menu-bookmark',
  templateUrl: './dashboard-menu-bookmark.component.html',
  styleUrls: ['./dashboard-menu-bookmark.component.css']
})
export class DashboardMenuBookmarkComponent implements OnInit {

  showBookmarked$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.showBookmarked$ = store.select(fromDashboardSelectors.getShowBookmarkedStatus);
  }

  ngOnInit() {
  }

  toggleBookmarked(e) {
    e.stopPropagation();
    this.store.dispatch(new fromDashboardActions.ToggleBookmarkedAction());
  }

}
