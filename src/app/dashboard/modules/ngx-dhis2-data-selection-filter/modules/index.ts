import { NgxDhis2OrgUnitFilterModule } from '@iapps/ngx-dhis2-org-unit-filter';

import { DataFilterModule } from './data-filter/data-filter.module';
import { LayoutModule } from './layout/layout.module';
import { LegendSetConfigurationModule } from './legend-set-configuration/legend-set-configuration.module';
import { PeriodFilterModule } from './period-filter/period-filter.module';

export const filterModules: any[] = [
  DataFilterModule,
  PeriodFilterModule,
  NgxDhis2OrgUnitFilterModule,
  LayoutModule,
  LegendSetConfigurationModule
];
