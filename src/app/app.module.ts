import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { reducers, metaReducers, effects } from './store';
import { RouteSerializer } from './utils';

import { NgxDhis2MenuModule } from '@hisptz/ngx-dhis2-menu';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragulaModule.forRoot(),
    /**
     * Translation module
     */
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    /**
     * Menu  module
     */
    NgxDhis2MenuModule,
    /**
     * Routing module
     */
    AppRoutingModule,

    /**
     * Module for registering ngrx store reducers
     */
    StoreModule.forRoot(reducers, { metaReducers }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule.forRoot(),

    /**
     * Module for registering ngrx store side effects
     */
    EffectsModule.forRoot(effects),

    /**
     * Development tool for debugging ngrx store operations
     */
    // !environment.production ? StoreDevtoolsModule.instrument() : []
    StoreDevtoolsModule.instrument()
  ],
  providers: [{ provide: RouterStateSerializer, useClass: RouteSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule {}
