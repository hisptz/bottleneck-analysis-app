import { DataFilterModule } from './data-filter/data-filter.module';
import { PeriodFilterModule } from './period-filter/period-filter.module';
import { NgxDhis2OrgUnitFilterModule } from './ngx-dhis2-org-unit-filter/ngx-dhis2-org-unit-filter.module';
import { LayoutModule } from './layout/layout.module';

export const filterModules: any[] = [
  DataFilterModule,
  PeriodFilterModule,
  NgxDhis2OrgUnitFilterModule,
  LayoutModule
];
