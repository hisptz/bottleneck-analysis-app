import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';
import { modules } from './modules';

import { reducers } from './store/reducers/index';
import { effects } from './store/effects/index';
import { SharedModule } from '../shared/shared.module';
import { DashboardDeleteDialogComponent } from './components/dashboard-delete-dialog/dashboard-delete-dialog.component';
import { DefaultInterventionsDialogComponent } from './containers/default-interventions-dialog/default-interventions-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    TranslateModule.forChild(),
    ...modules,
    ...reducers,
    effects,
    SharedModule,
  ],
  declarations: [
    ...containers,
    ...components,
    ...pipes,
    DashboardDeleteDialogComponent,
  ],
  entryComponents: [
    DashboardDeleteDialogComponent,
    DefaultInterventionsDialogComponent,
  ],
})
export class DashboardModule {}
