import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application-state";
import {LoadCurrentUserAction, LoadDashboardsAction, CurrentDashboardChangeAction} from "./store/actions";
import {userLastDashboardSelector} from "./store/selectors/user-last-dashboard.selector";
import {Router, ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  loading: boolean = true;
  constructor(
    private store: Store<ApplicationState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    store.select(userLastDashboardSelector).subscribe(dashboardId => {
      if(dashboardId != null) {
        this.loading = false;
        router.navigate(['dashboards/' + dashboardId]);

      }
    })
  }

  ngOnInit() {
    const currentHref = window.location.href;
    if(currentHref.split('/').indexOf('dashboards') != -1) {
      this.loading = false;
    }
    this.store.dispatch(new LoadCurrentUserAction());
    this.store.dispatch(new LoadDashboardsAction());
  }
}
