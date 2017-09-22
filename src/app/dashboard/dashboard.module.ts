import {Inject, NgModule} from '@angular/core';
import {APP_BASE_HREF, CommonModule} from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {DashboardNotificationAreaComponent} from './components/dashboard-notification-area/dashboard-notification-area.component';
import {DashboardNotificationService} from './providers/dashboard-notification.service';
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng2PaginationModule} from 'ng2-pagination';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {FilterPipe} from './pipes/filter.pipe';
import { EditDashboardComponent } from './components/edit-dashboard/edit-dashboard.component';
import {VisualizationObjectService} from './providers/visualization-object.service';
import {EffectsModule} from '@ngrx/effects';
import {VisualizationObjectEffect} from '../store/effects/visualization-object.effect';
import { DashboardItemCardComponent } from './components/dashboard-item-card/dashboard-item-card.component';
import {FavoriteEffect} from '../store/effects/favorite.effect';
import {FavoriteService} from './providers/favorite.service';
import {DndModule} from 'ng2-dnd';
import {AnalyticsService} from './providers/analytics.service';
import {AnalyticsEffect} from '../store/effects/analytics.effect';
import { ChartComponent } from './components/chart/chart.component';
import { ChartTemplateComponent } from './components/chart-template/chart-template.component';
import {ChartService} from './providers/chart.service';
import {VisualizationService} from './providers/visualization.service';
import {TreeModule} from 'angular-tree-component';
import {FilterLevelPipe} from './pipes/filter-level.pipe';
import { FavoriteSettingsComponent } from './components/favorite-settings/favorite-settings.component';
import {TruncatePipe} from './pipes/truncate.pipe';
import { MapComponent } from './components/map/map.component';
import {GeoFeatureService} from './providers/geo-feature.service';
import {LegendSetService} from './providers/legend-set.service';
import {OrgunitGroupSetService} from './providers/orgunit-group-set.service';
import {MapService} from './providers/map.service';
import {MapVisualizationService} from './providers/map-visualization.service';
import {ColorInterpolationService} from './providers/color-interpolation.service';
import {TileLayers} from './constants/tile-layers';
import { MapTemplateComponent } from './components/map-template/map-template.component';
import { MetadataDictionaryComponent } from './components/metadata-dictionary/metadata-dictionary.component';
import {AccordionModule, TooltipModule} from 'ngx-bootstrap';
import { TableComponent } from './components/table/table.component';
import {TableService} from './providers/table.service';
import {ProgressComponent} from '../components/progress/progress.component';
import { DashboardGroupSettingsComponent } from './components/dashboard-group-settings/dashboard-group-settings.component';
import {VisualizationLegendComponent} from './components/visualization-legend/visualization-legend.component';
import { DashboardItemSearchComponent } from './components/dashboard-item-search/dashboard-item-search.component';
import {ReadableNamePipe} from './pipes/readable-name.pipe';
import { UsersComponent } from './components/users/users.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AppComponent } from './components/app/app.component';
import {SafePipe} from './pipes/safe.pipe';
import {ErrorNotifierComponent} from './components/error-notifier/error-notifier.component';
import {MapTableComponent} from './components/map-table/map-table.component';
import {VisualizerService} from './providers/visualizer.service';
import {DimensionsModule} from '../dimensions/dimensions.module';
import {LayerFormComponent} from './components/layer-form/layer-form.component';
import {MapFilesConversion} from './providers/map-files-conversion.service';
import { TableTemplateComponent } from './components/table-template/table-template.component';
import {RelativePeriodService} from './providers/relative-period.service';
import {DashboardShareComponent} from './components/dashboard-share/dashboard-share.component';
import {DragulaModule} from 'ng2-dragula';
import {MessageModule} from '../message/message.module';
import {SharedModule} from '../shared/shared.module';
import {PeriodFilterModule} from '../period-filter/period-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    Ng2PaginationModule,
    EffectsModule.run(VisualizationObjectEffect),
    EffectsModule.run(FavoriteEffect),
    EffectsModule.run(AnalyticsEffect),
    DndModule.forRoot(),
    AccordionModule.forRoot(),
    TreeModule,
    DimensionsModule,
    TooltipModule.forRoot(),
    DragulaModule,
    MessageModule,
    SharedModule,
    PeriodFilterModule
  ],
  declarations: [
    DashboardComponent,
    DashboardNotificationAreaComponent,
    DashboardMenuComponent,
    CreateDashboardComponent,
    ClickOutsideDirective,
    FilterPipe,
    EditDashboardComponent,
    DashboardItemCardComponent,
    ChartComponent,
    ChartTemplateComponent,
    FilterLevelPipe,
    FavoriteSettingsComponent,
    TruncatePipe,
    MapComponent,
    MapTemplateComponent,
    VisualizationLegendComponent,
    MapTableComponent,
    MetadataDictionaryComponent,
    TableComponent,
    ProgressComponent,
    DashboardGroupSettingsComponent,
    DashboardItemSearchComponent,
    ReadableNamePipe,
    UsersComponent,
    ResourcesComponent,
    ReportsComponent,
    AppComponent,
    SafePipe,
    ErrorNotifierComponent,
    LayerFormComponent,
    MapTableComponent,
    TableTemplateComponent,
    DashboardShareComponent
  ],
  providers: [
  ]
})
export class DashboardModule { }
