import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';
import { directives } from './directives';
import { modules } from './modules';

import { reducers } from './store/reducers/index';
import { effects } from './store/effects/index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    TranslateModule.forChild(),
    ...modules,
    ...reducers,
    effects
  ],
  declarations: [...containers, ...components, ...pipes, ...directives]
})
export class DashboardModule {}
