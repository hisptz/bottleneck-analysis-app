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
  StoreRouterConnectingModule, DefaultRouterStateSerializer,
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
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';
import { SelectionFilterDialogComponent } from './dashboard/modules/selection-filters/components/selection-filter-dialog/selection-filter-dialog.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

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
        deps: [HttpClient],
      },
    }),
    NgxDhis2HttpClientModule.forRoot({
      version: 1,
      namespace: 'bottleneck',
      models: {
        organisationUnits: 'id,level',
        organisationUnitLevels: 'id,level',
        organisationUnitGroups: 'id',
      },
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
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer }),

    /**
     * Module for registering ngrx store side effects
     */
    EffectsModule.forRoot(effects),

    /**
     * Development tool for debugging ngrx store operations
     */
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],

  providers: [
    { provide: RouterStateSerializer, useClass: RouteSerializer },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
