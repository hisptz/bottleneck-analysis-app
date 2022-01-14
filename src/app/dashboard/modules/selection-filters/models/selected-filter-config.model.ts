import { PeriodFilterConfig } from '@iapps/ngx-dhis2-period-filter';
import { OrgUnitFilterConfig } from 'src/app/ngx-dhis2-org-unit-filter/models/org-unit-filter-config.model';

export interface SelectionFilterConfig {
  showDataFilter?: boolean;
  showPeriodFilter?: boolean;
  showOrgUnitFilter?: boolean;
  showLayout?: boolean;
  showFilterButton?: boolean;
  periodFilterConfig?: PeriodFilterConfig;
  orgUnitFilterConfig?: OrgUnitFilterConfig;
}
