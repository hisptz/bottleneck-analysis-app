import {Component, OnInit} from '@angular/core';
import {ApplicationState} from './store/application-state';
import {Store} from '@ngrx/store';
import {LoadCurrentUserAction, LoadDashboardsAction, LoadSystemInfoAction} from './store/actions';
import {apiRootUrlSelector} from './store/selectors/api-root-url.selector';
import {Observable} from 'rxjs/Observable';
import {LoginRedirectService} from './providers/login-redirect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<ApplicationState>,
    private loginRedirectService: LoginRedirectService
  ) {
    store.dispatch(new LoadSystemInfoAction());
  }

  ngOnInit() {
    this.store.select(apiRootUrlSelector).subscribe((rootUrl: string) => {
      if (rootUrl !== '') {
        this.store.dispatch(new LoadCurrentUserAction(rootUrl));
        this.store.dispatch(new LoadDashboardsAction(rootUrl));
      }
    });

    this.loginRedirectService.checkIfLogin('../../../')
  }
}
