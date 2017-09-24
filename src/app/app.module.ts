import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {INITIAL_APPLICATION_STATE} from './store/application-state';
import {combineReducers, StoreModule} from '@ngrx/store';
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
import {FormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component';
import {DashboardService} from './providers/dashboard.service';
import {CurrentUserService} from './providers/current-user.service';
import {DashboardEffect} from './store/effects/dashboard.effect';
import {CurrentUserEffect} from './store/effects/current-user.effect';
import {AppRoutingModule} from './app.routing.module';
import {DashboardNotificationEffect} from './store/effects/dashboard-notification.effect';
import {DashboardNotificationService} from './dashboard/providers/dashboard-notification.service';
import {UtilitiesService} from './providers/utilities.service';
import {LoginRedirectService} from './providers/login-redirect.service';
import {MenuModule} from './menu/menu.module';
import {VisualizationObjectService} from './dashboard/providers/visualization-object.service';
import {FavoriteService} from './dashboard/providers/favorite.service';
import {AnalyticsService} from './dashboard/providers/analytics.service';
import {ChartService} from './dashboard/providers/chart.service';
import {VisualizationService} from './dashboard/providers/visualization.service';
import {GeoFeatureService} from './dashboard/providers/geo-feature.service';
import {LegendSetService} from './dashboard/providers/legend-set.service';
import {OrgunitGroupSetService} from './dashboard/providers/orgunit-group-set.service';
import {MapService} from './dashboard/providers/map.service';
import {MapVisualizationService} from './dashboard/providers/map-visualization.service';
import {ColorInterpolationService} from './dashboard/providers/color-interpolation.service';
import {TileLayers} from './dashboard/constants/tile-layers';
import {TableService} from './dashboard/providers/table.service';
import {VisualizerService} from './dashboard/providers/visualizer.service';
import {MapFilesConversion} from './dashboard/providers/map-files-conversion.service';
import {RelativePeriodService} from './dashboard/providers/relative-period.service';
import {DimensionsModule} from './dimensions/dimensions.module';
import {environment} from '../environments/environment';
import {LoaderComponent} from './components/loader/loader.component';
import {VisualizationObjectEffect} from './store/effects/visualization-object.effect';
import {FavoriteEffect} from './store/effects/favorite.effect';
import {AnalyticsEffect} from './store/effects/analytics.effect';
import { storeFreeze } from 'ngrx-store-freeze';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    LoaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MenuModule,
    DimensionsModule,
    StoreModule.provideStore({uiState: uiStateReducer, storeData: storeDataReducer} , INITIAL_APPLICATION_STATE),
    EffectsModule.run(SystemInfoEffect),
    EffectsModule.run(DashboardEffect),
    EffectsModule.run(CurrentUserEffect),
    EffectsModule.run(DashboardNotificationEffect),
    EffectsModule.run(VisualizationObjectEffect),
    EffectsModule.run(FavoriteEffect),
    EffectsModule.run(AnalyticsEffect),
    // !environment.production ? StoreDevtoolsModule.instrumentOnlyWithExtension() : []
  ],
  providers: [
    SystemInfoService,
    ManifestService,
    HttpClientService,
    DashboardService,
    CurrentUserService,
    DashboardNotificationService,
    UtilitiesService,
    LoginRedirectService,
    DashboardNotificationService,
    VisualizationObjectService,
    FavoriteService,
    AnalyticsService,
    ChartService,
    VisualizationService,
    GeoFeatureService,
    LegendSetService,
    OrgunitGroupSetService,
    MapService,
    MapVisualizationService,
    ColorInterpolationService,
    TileLayers,
    TableService,
    VisualizerService,
    MapFilesConversion,
    RelativePeriodService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
