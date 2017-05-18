import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {INITIAL_APPLICATION_STATE} from "./store/application-state";
import {StoreModule} from "@ngrx/store";
import {uiStateReducer} from "./store/reducers/ui-state.reducer";
import {storeDataReducer} from "./store/reducers/store-data.reducer";
import { LoaderComponent } from './components/loader/loader.component';
import {LoadCurrentUserEffectService} from "./store/effects/load-current-user-effect.service";
import {EffectsModule} from "@ngrx/effects";
import {CurrentUserService} from "./services/current-user.service";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {DashboardService} from "./services/dashboard.service";
import {LoadDashboardsEffectService} from "./store/effects/load-dashboards-effect.service";
import {AppRoutingModule} from "./app.routing.module";
import {DashboardNotificationAreaComponent} from "./components/dashboard-notification-area/dashboard-notification-area.component";
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import { DashboardMenuItemsComponent } from './components/dashboard-menu-items/dashboard-menu-items.component';
import {TooltipModule} from "ngx-bootstrap";
import { DashboardEditFormComponent } from './components/dashboard-edit-form/dashboard-edit-form.component';
import {UpdateDashboardEffectService} from "./store/effects/update-dashboard-effect.service";
import { DashboardItemCardComponent } from './components/dashboard-item-card/dashboard-item-card.component';
import { ChartComponent } from './components/chart/chart.component';
import { MapComponent } from './components/map/map.component';
import { TableComponent } from './components/table/table.component';
import {ChartService} from "./services/chart.service";
import {MapService} from "./services/map.service";
import {TableService} from "./services/table.service";
import {AnalyticsService} from "./services/analytics.service";
import {Constants} from "./services/constants";
import {Utilities} from "./services/utilities";
import {Store} from "./services/store";
import {VisualizationStore} from "./services/visualization-store";
import {VisualizerService} from "./services/visualizer.service";
import {Ng2PaginationModule} from "ng2-pagination";
import {ErrorNotifierComponent} from "./components/error-notifier/error-notifier.component";
import {Ng2HighchartsModule} from "ng2-highcharts";
import {FavoriteService} from "./services/favorite.service";
import {VisualizationObjectService} from "./services/visualization-object.service";
import {LoadVisualizationObjectEffectService} from "./store/effects/load-visualization-effect.service";
import {ChangeCurrentVisualizationObjectEffectService} from "./store/effects/change-current-visualization-effect.service";
import {TreeModule} from "angular-tree-component/dist/angular-tree-component";
import {OrgUnitService} from "./components/org-unit-filter/org-unit.service";
import {OrgUnitFilterComponent} from "./components/org-unit-filter/org-unit-filter.component";
import {PeriodFilterComponent} from "./components/period-filter/period-filter.component";
import {ChangeFiltersEffectService} from "./store/effects/change-filters-effect.service";
import {LayoutComponent} from "./components/layout/layout.component";
import {DndModule} from "ng2-dnd";
import {ChangeLayoutEffectService} from "./store/effects/change-layout-effect.service";
import { DashboardAddFormComponent } from './components/dashboard-add-form/dashboard-add-form.component';
import {AddDashboardEffectService} from "./store/effects/add-dashboard-effect.service";
import { ClickOutsideDirective } from './directives/click-outside.directive';
import {DeleteDashboardEffectService} from "./store/effects/delete-dashboard-effect.service";
import {DeleteDashboardItemEffectService} from "./store/effects/delete-dashboard-item-effect.service";
import { DashboardItemSearchComponent } from './components/dashboard-item-search/dashboard-item-search.component';
import {SearchService} from "./services/search.service";
import { ReadableNamePipe } from './pipes/readable-name.pipe';
import {AddDashboardItemEffectService} from "./store/effects/add-dashboard-item-effect.service";
import { UserComponent } from './components/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    DashboardComponent,
    DashboardNotificationAreaComponent,
    DashboardMenuComponent,
    DashboardMenuItemsComponent,
    DashboardEditFormComponent,
    DashboardItemCardComponent,
    ChartComponent,
    MapComponent,
    TableComponent,
    ErrorNotifierComponent,
    OrgUnitFilterComponent,
    PeriodFilterComponent,
    LayoutComponent,
    DashboardAddFormComponent,
    ClickOutsideDirective,
    DashboardItemSearchComponent,
    ReadableNamePipe,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2PaginationModule,
    Ng2HighchartsModule,
    TreeModule,
    TooltipModule.forRoot(),
    DndModule.forRoot(),
    StoreModule.provideStore({uiState: uiStateReducer,storeData: storeDataReducer},INITIAL_APPLICATION_STATE),
    EffectsModule.run(LoadCurrentUserEffectService),
    EffectsModule.run(LoadDashboardsEffectService),
    EffectsModule.run(UpdateDashboardEffectService),
    EffectsModule.run(LoadVisualizationObjectEffectService),
    EffectsModule.run(ChangeCurrentVisualizationObjectEffectService),
    EffectsModule.run(ChangeFiltersEffectService),
    EffectsModule.run(ChangeLayoutEffectService),
    EffectsModule.run(AddDashboardEffectService),
    EffectsModule.run(DeleteDashboardEffectService),
    EffectsModule.run(DeleteDashboardItemEffectService),
    EffectsModule.run(AddDashboardItemEffectService),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [CurrentUserService, DashboardService, ChartService, TableService, MapService, AnalyticsService,Constants,Utilities,Store,VisualizationStore, VisualizerService, FavoriteService,VisualizationObjectService, OrgUnitService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
