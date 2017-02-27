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
import {UtilitiesService} from "./providers/utilities.service";
import {ModalModule, TabsModule, TooltipModule, DropdownModule, AccordionModule} from "ng2-bootstrap";
import { DashboardItemInterpretationComponent } from './components/dashboard-item-interpretation/dashboard-item-interpretation.component';
import {ContextMenuService, ContextMenuComponent} from "angular2-contextmenu";
import { EditDashboardComponent } from './components/edit-dashboard/edit-dashboard.component';
import {DashboardSearchService} from "./providers/dashboard-search.service";
import { ReadableNamePipe } from './pipes/readable-name.pipe';
import { AutosizeDirective } from './directives/autosize.directive';
import {InterpretationService} from "./providers/interpretation.service";
import { TruncatePipe } from './pipes/truncate.pipe';
import {MomentModule} from "angular2-moment";
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorNotifierComponent } from './components/error-notifier/error-notifier.component';
import {Ng2HighchartsModule} from "ng2-highcharts";
import {TreeModule} from "angular2-tree-component";
import {MetadataDictionaryComponent} from "./components/ng2-metadata-dictionary/metadata-dictionary.component";
import { OrganisationUnitTreeComponent } from './components/organisation-unit-tree/organisation-unit-tree.component';
import {OrgUnitService} from "./providers/org-unit.service";
import {FilterService} from "./providers/filter.service";
import { PeriodFilterComponent } from './components/period-filter/period-filter.component';
import { DragabbleDirective } from './components/dashboard-layout/directives/dragabble.directive';
import { DropTargetDirective } from './components/dashboard-layout/directives/drop-target.directive';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import {DndModule} from "ng2-dnd";

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
      DropdownModule.forRoot(),
      AccordionModule.forRoot(),
      MomentModule,
      Ng2HighchartsModule,
      TreeModule,
      DndModule.forRoot()
  ],
  declarations: [DashboardComponent, DashboardItemCardComponent, DashboardItemSearchComponent, DashboardShareComponent, DashboardDimensionsComponent, DashboardPeriodSettingsComponent, DashboardOrgunitSettingsComponent, DashboardItemsComponent, DashboardLandingComponent, DashboardMenuItemsComponent, DashboardMenuPaginationComponent, CreateDashboardComponent, DashboardItemInterpretationComponent, ContextMenuComponent, EditDashboardComponent, ReadableNamePipe, AutosizeDirective, TruncatePipe, LoaderComponent, ErrorNotifierComponent,MetadataDictionaryComponent, OrganisationUnitTreeComponent, PeriodFilterComponent, DragabbleDirective, DropTargetDirective, DashboardLayoutComponent],
  providers: [
      DashboardSettingsService,
      DashboardService,
      DashboardItemService,
      VisualizerService,
      UtilitiesService,
      ContextMenuService,
      DashboardSearchService,
      InterpretationService,
      OrgUnitService,
      FilterService
  ]
})
export class DashboardModule { }
