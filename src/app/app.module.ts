import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { effects } from './effects';
import { RouteSerializer } from './utils';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    /**
     * Routing module
     */
    AppRoutingModule,

    /**
     * Module for registering service worker
     */
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),

    /**
     * Module for registering ngrx store reducers
     */
    StoreModule.forRoot(reducers, { metaReducers }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule,

    /**
     * Module for registering ngrx store side effects
     */
    EffectsModule.forRoot(effects),

    /**
     * Development tool for debugging ngrx store operations
     */
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [{ provide: RouterStateSerializer, useClass: RouteSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule {}
