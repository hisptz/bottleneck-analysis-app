import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {DashboardNotificationAreaComponent} from './components/dashboard-notification-area/dashboard-notification-area.component';
import {DashboardNotificationService} from './providers/dashboard-notification.service';
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DashboardMenuItemComponent } from './components/dashboard-menu-item/dashboard-menu-item.component';
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
import {OrgUnitService} from './components/org-unit-filter/org-unit.service';
import {OrgUnitFilterComponent} from './components/org-unit-filter/org-unit-filter.component';
import {PeriodFilterComponent} from './components/period-filter/period-filter.component';
import {MultiselectComponent} from './components/org-unit-filter/multiselect/multiselect.component';
import {TreeModule} from 'angular-tree-component';
import {FilterLevelPipe} from './pipes/filter-level.pipe';

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
    TreeModule
  ],
  declarations: [
    DashboardComponent,
    DashboardNotificationAreaComponent,
    DashboardMenuComponent,
    CreateDashboardComponent,
    DashboardMenuItemComponent,
    ClickOutsideDirective,
    FilterPipe,
    EditDashboardComponent,
    DashboardItemCardComponent,
    ChartComponent,
    ChartTemplateComponent,
    OrgUnitFilterComponent,
    PeriodFilterComponent,
    MultiselectComponent,
    FilterLevelPipe
  ],
  providers: [
    DashboardNotificationService,
    VisualizationObjectService,
    FavoriteService,
    AnalyticsService,
    ChartService,
    VisualizationService,
    OrgUnitService
  ]
})
export class DashboardModule { }
