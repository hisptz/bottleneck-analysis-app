import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { State, LoadSystemInfo } from './store';
import { Title } from '@angular/platform-browser';
import { LoadDataGroups } from './store/actions/data-group.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private store: Store<State>,
    private translate: TranslateService,
    private titleService: Title
  ) {
    // Load system information
    this.store.dispatch(new LoadSystemInfo());

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    this.setTitle('Bottleneck Analysis App');
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
