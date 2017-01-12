import {ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {DashboardLandingComponent} from "./pages/dashboard-landing/dashboard-landing.component";
import {DashboardItemsComponent} from "./pages/dashboard-items/dashboard-items.component";
export const DashboardRouteModule: ModuleWithProviders = RouterModule.forChild([
    {path: '',  component: DashboardComponent, children: [
        {path: '', component: DashboardLandingComponent},
        {path: 'dashboards/:id/dashboard', component: DashboardItemsComponent}
    ]},
])