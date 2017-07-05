import {CurrentUser} from '../model/current-user';
import {Dashboard} from '../model/dashboard';
import {Visualization} from '../dashboard/model/visualization';
import {ChartConfiguration} from '../dashboard/model/chart-configuration';
export interface StoreData {
  currentUser: CurrentUser;
  dashboards: Dashboard[];
  favorites: any[];
  analytics: any[],
  chartConfigurations: ChartConfiguration[];
  chartObjects: any[];
  dashboardNotification: any;
  visualizationObjects: Visualization[]
  geoFeatures: any[];
  legendSets: any[];
  orgUnitGroupSets: any[];
  globalFilters: any;
}

export const INITIAL_STORE_DATA: StoreData = {
  currentUser: {
    id: undefined,
    name: undefined,
    displayName: undefined,
    email: undefined,
    created: undefined,
    lastUpdated: undefined,
    dataViewOrganisationUnits: [],
    userCredentials: {}
  },
  dashboards: [],
  favorites: [],
  analytics: [],
  dashboardNotification: null,
  visualizationObjects: [],
  chartConfigurations: [],
  chartObjects: [],
  geoFeatures: [],
  legendSets: [],
  orgUnitGroupSets: [],
  globalFilters: null
};
