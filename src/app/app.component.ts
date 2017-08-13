import {Component, OnInit} from '@angular/core';
import {ApplicationState} from './store/application-state';
import {Store} from '@ngrx/store';
import {
  LoadCurrentUserAction, LoadDashboardsAction, LoadDashboardsCustomSettingsAction, LoadDashboardSearchItemsAction,
  LoadFavoriteOptionsAction,
  LoadSystemInfoAction
} from './store/actions';
import {apiRootUrlSelector} from './store/selectors/api-root-url.selector';
import {LoginRedirectService} from './providers/login-redirect.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<ApplicationState>,
    private loginRedirectService: LoginRedirectService,
    private titleService: Title
  ) {
    store.dispatch(new LoadSystemInfoAction());
  }

  ngOnInit() {
    this.setTitle('Interactive Dashboard 2');
    this.store.select(apiRootUrlSelector).subscribe((rootUrl: string) => {
      if (rootUrl !== '') {
        this.store.dispatch(new LoadCurrentUserAction(rootUrl));
        this.store.dispatch(new LoadDashboardsAction(rootUrl));
        this.store.dispatch(new LoadDashboardsCustomSettingsAction(rootUrl));
      }
    });
    this.loginRedirectService.checkIfLogin('../../../')
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
}
