import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {INITIAL_APPLICATION_STATE} from './store/application-state';
import {StoreModule} from '@ngrx/store';
import {uiStateReducer} from './store/reducers/ui-store-reducer';
import {storeDataReducer} from './store/reducers/store-data-reducer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {SystemInfoEffect} from './store/effects/system-info.effect';
import {SystemInfoService} from './providers/system-info.service';
import {ManifestService} from './providers/manifest.service';
import {HttpClientService} from './providers/http-client.service';
import {HttpModule} from '@angular/http';
import { NotificationComponent } from './components/notification/notification.component';
import {MenuComponent} from './components/menu/menu.component';
import {FormsModule} from '@angular/forms';
import {FilterPipe} from './components/menu/filter.pipe';
import { HomeComponent } from './home/home.component';
import {DashboardService} from './providers/dashboard.service';
import {CurrentUserService} from './providers/current-user.service';
import {DashboardEffect} from './store/effects/dashboard.effect';
import {CurrentUserEffect} from './store/effects/current-user.effect';
import {AppRoutingModule} from './app.routing.module';
import {LoaderComponent} from './components/loader/loader.component';
import {DashboardNotificationEffect} from './store/effects/dashboard-notification.effect';
import {DashboardNotificationService} from './dashboard/providers/dashboard-notification.service';
import {UtilitiesService} from './providers/utilities.service';
import {LoginRedirectService} from './providers/login-redirect.service';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    MenuComponent,
    FilterPipe,
    HomeComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    StoreModule.provideStore({uiState: uiStateReducer, storeData: storeDataReducer}, INITIAL_APPLICATION_STATE),
    EffectsModule.run(SystemInfoEffect),
    EffectsModule.run(DashboardEffect),
    EffectsModule.run(CurrentUserEffect),
    EffectsModule.run(DashboardNotificationEffect),
    // StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    SystemInfoService,
    ManifestService,
    HttpClientService,
    DashboardService,
    CurrentUserService,
    DashboardNotificationService,
    UtilitiesService,
    LoginRedirectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
