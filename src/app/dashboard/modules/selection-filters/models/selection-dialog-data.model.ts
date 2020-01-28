import { OrgUnitFilterConfig } from '@iapps/ngx-dhis2-org-unit-filter';
import { PeriodFilterConfig } from '@iapps/ngx-dhis2-period-filter';

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
}
