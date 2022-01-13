
import { PeriodFilterConfig } from '@iapps/ngx-dhis2-period-filter';
import { OrgUnitFilterConfig } from 'src/app/ngx-dhis2-org-unit-filter/models/org-unit-filter-config.model';

export interface SelectionDialogData {
  selectedFilter: string;
  selectedData: any[];
  selectedDataGroups: any[];
  selectedPeriods: any[];
  periodFilterConfig: PeriodFilterConfig;
  orgUnitFilterConfig: OrgUnitFilterConfig;
  selectedOrgUnits: any[];
  generalDataConfiguration: any;
  userAccesses: any[];
  userGroupAccesses: any[];
  publicAccess: string;
  bottleneckPeriodType: string;
  interventionName: string;
}
