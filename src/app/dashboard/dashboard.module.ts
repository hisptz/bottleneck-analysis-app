import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardRouteModule} from "./dashboard.routing.module";
import {SharedModule} from "../shared/shared-module.module";
import { DashboardItemCardComponent } from './components/dashboard-item-card/dashboard-item-card.component';
import { DashboardItemSearchComponent } from './components/dashboard-item-search/dashboard-item-search.component';
import {DashboardSettingsService} from "./providers/dashboard-settings.service";
import { DashboardShareComponent } from './components/dashboard-share/dashboard-share.component';
import { DashboardDimensionsComponent } from './components/dashboard-dimensions/dashboard-dimensions.component';
import { DashboardPeriodSettingsComponent } from './components/dashboard-period-settings/dashboard-period-settings.component';
import { DashboardOrgunitSettingsComponent } from './components/dashboard-orgunit-settings/dashboard-orgunit-settings.component';
import {DashboardService} from "./providers/dashboard.service";
import { DashboardItemsComponent } from './pages/dashboard-items/dashboard-items.component';
import { DashboardLandingComponent } from './pages/dashboard-landing/dashboard-landing.component';
import { DashboardMenuItemsComponent } from './components/dashboard-menu-items/dashboard-menu-items.component';
import { DashboardMenuPaginationComponent } from './components/dashboard-menu-pagination/dashboard-menu-pagination.component';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardItemService} from "./providers/dashboard-item.service";
import {VisualizerService} from "./providers/dhis-visualizer.service";
import { DashboardItemChartComponent } from './components/dashboard-item-chart/dashboard-item-chart.component';
import { DashboardItemMapComponent } from './components/dashboard-item-map/dashboard-item-map.component';
import { DashboardItemUsersComponent } from './components/dashboard-item-users/dashboard-item-users.component';
import { DashboardItemEventReportComponent } from './components/dashboard-item-event-report/dashboard-item-event-report.component';
import { DashboardItemReportComponent } from './components/dashboard-item-report/dashboard-item-report.component';
import { DashboardItemResourcesComponent } from './components/dashboard-item-resources/dashboard-item-resources.component';
import {UtilitiesService} from "./providers/utilities.service";
import {ModalModule, TabsModule, TooltipModule} from "ng2-bootstrap";
import { DashboardItemTableComponent } from './components/dashboard-item-table/dashboard-item-table.component';
import { DashboardItemInterpretationComponent } from './components/dashboard-item-interpretation/dashboard-item-interpretation.component';
import { DashboardItemDictionaryComponent } from './components/dashboard-item-dictionary/dashboard-item-dictionary.component';
import {ContextMenuService, ContextMenuComponent} from "angular2-contextmenu";
import { EditDashboardComponent } from './components/edit-dashboard/edit-dashboard.component';
import {DashboardSearchService} from "./providers/dashboard-search.service";
import { SearchResultBodyComponent } from './components/search-result-body/search-result-body.component';
import { ReadableNamePipe } from './pipes/readable-name.pipe';
import { AutosizeDirective } from './directives/autosize.directive';
import {InterpretationService} from "./providers/interpretation.service";
import { TruncatePipe } from './pipes/truncate.pipe';
import {MomentModule} from "angular2-moment";
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorNotifierComponent } from './components/error-notifier/error-notifier.component';
import {Ng2HighchartsModule} from "ng2-highcharts";

@NgModule({
  imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      SharedModule,
      DashboardRouteModule,
      ModalModule.forRoot(),
      TabsModule.forRoot(),
      TooltipModule.forRoot(),
      MomentModule,
      Ng2HighchartsModule
  ],
  declarations: [DashboardComponent, DashboardItemCardComponent, DashboardItemSearchComponent, DashboardShareComponent, DashboardDimensionsComponent, DashboardPeriodSettingsComponent, DashboardOrgunitSettingsComponent, DashboardItemsComponent, DashboardLandingComponent, DashboardMenuItemsComponent, DashboardMenuPaginationComponent, CreateDashboardComponent, DashboardItemChartComponent, DashboardItemMapComponent, DashboardItemUsersComponent, DashboardItemEventReportComponent, DashboardItemReportComponent, DashboardItemResourcesComponent, DashboardItemTableComponent, DashboardItemInterpretationComponent, DashboardItemDictionaryComponent, ContextMenuComponent, EditDashboardComponent, SearchResultBodyComponent, ReadableNamePipe, AutosizeDirective, TruncatePipe, LoaderComponent, ErrorNotifierComponent],
  providers: [
      DashboardSettingsService,
      DashboardService,
      DashboardItemService,
      VisualizerService,
      UtilitiesService,
      ContextMenuService,
      DashboardSearchService,
      InterpretationService
  ]
})
export class DashboardModule { }
