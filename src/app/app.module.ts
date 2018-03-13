import { SafePipe } from './pipes/safe.pipe';
import { ReportsModule } from './modules/reports/reports.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { UsersContainerComponent } from './pages/dashboard/components/visualization-list/visualization-card/users-container/users-container.component';
import { UsersModule } from './modules/users/users.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoutingModule } from './app.routing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CustomSerializer } from './utils/custom-route-serializer.util';
import { effects } from './store/app.effects';
import { metaReducers, reducers } from './store/app.reducers';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientService } from './services/http-client.service';
import { ManifestService } from './services/manifest.service';
import { MenuModule } from './modules/menu/menu.module';
import { VisualizationListComponent } from './pages/dashboard/components/visualization-list/visualization-list.component';
import { VisualizationCardComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-card.component';
import { DashboardMenuComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu.component';
import { DashboardMenuDesktopComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-desktop/dashboard-menu-desktop.component';
import { DashboardMenuMobileComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-mobile/dashboard-menu-mobile.component';
import { DashboardMenuSearchComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-search/dashboard-menu-search.component';
import { DashboardMenuListDesktopComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-desktop/dashboard-menu-list-desktop/dashboard-menu-list-desktop.component';
import { DashboardMenuItemDesktopComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-desktop/dashboard-menu-item-desktop/dashboard-menu-item-desktop.component';
import { DashboardMenuCreateComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-create/dashboard-menu-create.component';
import { DashboardHeaderComponent } from './pages/dashboard/components/dashboard-header/dashboard-header.component';
import { CurrentDashboardTitleComponent } from './pages/dashboard/components/dashboard-header/current-dashboard-title/current-dashboard-title.component';
import { CurrentDashboardDescriptionComponent } from './pages/dashboard/components/dashboard-header/current-dashboard-description/current-dashboard-description.component';
import { DashboardGlobalFilterComponent } from './pages/dashboard/components/dashboard-header/dashboard-global-filter/dashboard-global-filter.component';
import { DashboardItemSearchComponent } from './pages/dashboard/components/dashboard-header/dashboard-item-search/dashboard-item-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { VisualizationFilterSectionComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-filter-section/visualization-filter-section.component';
import { VisualizationInterpretationButtonComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-interpretation-button/visualization-interpretation-button.component';
import { VisualizationDeleteSectionComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-delete-section/visualization-delete-section.component';
import { VisualizationResizeSectionComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-resize-section/visualization-resize-section.component';
import { VisualizationTypesSectionComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-types-section/visualization-types-section.component';
import { VisualizationDownloadSectionComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-download-section/visualization-download-section.component';
import { CurrentDashboardBookmarkButtonComponent } from './pages/dashboard/components/dashboard-header/current-dashboard-bookmark-button/current-dashboard-bookmark-button.component';
import { CurrentDashboardShareSectionComponent } from './pages/dashboard/components/dashboard-header/current-dashboard-share-section/current-dashboard-share-section.component';
import { ChartContainerComponent } from './pages/dashboard/components/visualization-list/visualization-card/chart-container/chart-container.component';
import { ChartModule } from './modules/chart/chart.module';
import { DashboardProgressComponent } from './pages/dashboard/components/dashboard-progress/dashboard-progress.component';
import { TableContainerComponent } from './pages/dashboard/components/visualization-list/visualization-card/table-container/table-container.component';
import { TableModule } from './modules/table/table.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { OrgUnitFilterModule } from './modules/org-unit-filter/org-unit-filter.module';
import { PeriodFilterModule } from './modules/period-filter/period-filter.module';
import { DataFilterModule } from './modules/data-filter/data-filter.module';
import { LayoutModule } from './modules/layout/layout.module';
import { MapModule } from './modules/map/map.module';
import { FullScreenDashboardItemViewComponent } from './pages/full-screen-dashboard-item-view/full-screen-dashboard-item-view.component';

import { DashboardMenuEditComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-edit/dashboard-menu-edit.component';
import { DashboardMenuDeleteComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-delete/dashboard-menu-delete.component';
import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { KNumberPipe } from './pipes/k-number.pipe';
import { SharedModule } from './shared/shared.module';
import { VisualizationCardLoaderComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-card-loader/visualization-card-loader.component';
import { InterpretationModule } from './modules/interpretation/interpretation.module';
import { InterpretationContainerComponent } from './pages/dashboard/components/visualization-list/visualization-card/interpretation-container/interpretation-container.component';
import { SharingFilterModule } from './modules/sharing-filter/sharing-filter.module';
import { VisualizationDeleteDialogComponent } from './pages/dashboard/components/visualization-list/visualization-card/visualization-delete-dialog/visualization-delete-dialog.component';
import { ResourcesContainerComponent } from './pages/dashboard/components/visualization-list/visualization-card/resources-container/resources-container.component';
import { ReportsContainerComponent } from './pages/dashboard/components/visualization-list/visualization-card/reports-container/reports-container.component';
import { AppContainerComponent } from './pages/dashboard/components/visualization-list/visualization-card/app-container/app-container.component';
import { DashboardMenuBookmarkComponent } from './pages/dashboard/components/dashboard-menu/dashboard-menu-bookmark/dashboard-menu-bookmark.component';
import { DashboardNotificationComponent } from './pages/dashboard/components/dashboard-header/dashboard-notification/dashboard-notification.component';
import { FeedbackMessageModule } from './modules/feedback-message/feedback-message.module';

// service worker module
import { ServiceWorkerModule } from '@angular/service-worker';

// Add a function, that returns a “TranslateHttpLoader” and export it (needed by AoT)
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    VisualizationListComponent,
    VisualizationCardComponent,
    DashboardMenuComponent,
    DashboardMenuDesktopComponent,
    DashboardMenuMobileComponent,
    DashboardMenuSearchComponent,
    DashboardMenuListDesktopComponent,
    DashboardMenuItemDesktopComponent,
    DashboardMenuCreateComponent,
    DashboardHeaderComponent,
    CurrentDashboardTitleComponent,
    CurrentDashboardDescriptionComponent,
    DashboardGlobalFilterComponent,
    DashboardItemSearchComponent,
    VisualizationFilterSectionComponent,
    VisualizationInterpretationButtonComponent,
    VisualizationDeleteSectionComponent,
    VisualizationResizeSectionComponent,
    VisualizationTypesSectionComponent,
    VisualizationDownloadSectionComponent,
    CurrentDashboardBookmarkButtonComponent,
    CurrentDashboardShareSectionComponent,
    ChartContainerComponent,
    DashboardProgressComponent,
    TableContainerComponent,
    FullScreenDashboardItemViewComponent,
    DashboardMenuEditComponent,
    DashboardMenuDeleteComponent,
    FilterByNamePipe,
    ClickOutsideDirective,
    KNumberPipe,
    VisualizationCardLoaderComponent,
    InterpretationContainerComponent,
    UsersContainerComponent,
    VisualizationDeleteDialogComponent,
    ResourcesContainerComponent,
    ReportsContainerComponent,
    AppContainerComponent,
    SafePipe,
    DashboardMenuBookmarkComponent,
    DashboardNotificationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MenuModule,
    ChartModule,
    TableModule,
    DictionaryModule,
    OrgUnitFilterModule,
    PeriodFilterModule,
    DataFilterModule,
    LayoutModule,
    SharedModule,
    InterpretationModule,
    SharingFilterModule,
    UsersModule,
    MapModule,
    ResourcesModule,
    ReportsModule,
    // TODO: We need to look and revisit to see. what is causing service worker not to be registered.
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    FeedbackMessageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    /**
     * Module for routing
     */
    RoutingModule,

    /**
     * Reducers
     */
    StoreModule.forRoot(reducers, { metaReducers }),

    /**
     * Effects
     */
    EffectsModule.forRoot(effects),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule,

    /**
     * Dev tool, enabled only in development mode
     */
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }, ManifestService, HttpClientService],
  bootstrap: [AppComponent]
})
export class AppModule {}
