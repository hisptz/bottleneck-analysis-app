import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Title } from '@angular/platform-browser';

import { Fn } from '@iapps/function-analytics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private titleService: Title
  ) {
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
