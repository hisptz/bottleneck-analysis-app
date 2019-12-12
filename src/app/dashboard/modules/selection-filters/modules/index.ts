import { NgxDhis2OrgUnitFilterModule } from '@iapps/ngx-dhis2-org-unit-filter';

import { DataFilterModule } from './data-filter/data-filter.module';
import { LegendSetConfigurationModule } from './legend-set-configuration/legend-set-configuration.module';
import { NgxDhis2PeriodFilterModule } from '@iapps/ngx-dhis2-period-filter';

export const filterModules: any[] = [
  DataFilterModule,
  NgxDhis2PeriodFilterModule,
  NgxDhis2OrgUnitFilterModule,
  LegendSetConfigurationModule,
];
