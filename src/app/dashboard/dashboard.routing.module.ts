import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
export const DashboardRouteModule: ModuleWithProviders = RouterModule.forChild([
    {path: '',  component: DashboardComponent}
])