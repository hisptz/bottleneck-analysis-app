import {Component, HostListener, OnInit} from '@angular/core';
import * as dashboard from '../../../../../store/dashboard/dashboard.actions';
import * as dashboardSelectors from '../../../../../store/dashboard/dashboard.selectors';
import {AppState} from '../../../../../store/app.reducers';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-dashboard-menu-desktop',
  templateUrl: './dashboard-menu-desktop.component.html',
  styleUrls: ['./dashboard-menu-desktop.component.css']
})
export class DashboardMenuDesktopComponent implements OnInit {

  currentDashboardPage$: Observable<number>;
  dashboardPages$: Observable<number>;
  private _dashboardSearchQuery$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _slideCss$: BehaviorSubject<string> = new BehaviorSubject<string>('slideInRight');
  slideCss$: Observable<string>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.organizeMenu(event.target.innerWidth);
  }
  constructor(private store: Store<AppState>) {
    this.currentDashboardPage$ = store.select(dashboardSelectors.getCurrentDashboardPage);
    this.dashboardPages$ = store.select(dashboardSelectors.getDashboardPages);
    this.slideCss$ = this._slideCss$.asObservable();
    this.organizeMenu(window.innerWidth);
  }

  ngOnInit() {
  }

  getPreviousPage(e) {
    e.stopPropagation();
    this.store.dispatch(new dashboard.ChangeCurrentPageAction(-1));
    this._slideCss$.next('slideInLeft');
  }

  getNextPage(e) {
    e.stopPropagation();
    this.store.dispatch(new dashboard.ChangeCurrentPageAction(1));
    this._slideCss$.next('slideInRight');
  }

  onDashboardSearch(searchQuery) {
    this.store.dispatch(new dashboard.SetSearchTermAction(searchQuery));
  }

  organizeMenu(width: number, forceReduce: boolean = false) {
    let itemsPerPage = 8;
    const additionalWidth =  800;
    const approximatedItemsPerPage: number = (width - additionalWidth) / 100;

    if (approximatedItemsPerPage >= 1 && approximatedItemsPerPage <= 8) {
      itemsPerPage = parseInt(approximatedItemsPerPage.toFixed(0), 10);
    } else if (approximatedItemsPerPage < 1) {
      itemsPerPage = 1;
    }

    this.store.dispatch(new dashboard.ChangePageItemsAction(itemsPerPage));
  }
}
