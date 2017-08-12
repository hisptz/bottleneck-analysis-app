import {CurrentUser} from '../model/current-user';
import {Dashboard} from '../model/dashboard';
import {Visualization} from '../dashboard/model/visualization';
import {ChartConfiguration} from '../dashboard/model/chart-configuration';
import {DashboardSearchItem} from '../dashboard/model/dashboard-search-item';
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
  favoriteOptions: any[];
  customDashboardSettings: any;
  dashboardSearchItems: DashboardSearchItem;
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
  globalFilters: null,
  favoriteOptions: [],
  customDashboardSettings: null,
  dashboardSearchItems: {
    loading: false,
    loaded: true,
    headers: [
      {
        name: 'all',
        selected: true
      },
      {
        icon: 'assets/img/users.png',
        name: 'users',
        selected: false
      },
      {
        icon: 'assets/img/table.png',
        name: 'tables',
        selected: false
      },
      {
        icon: 'assets/img/map.png',
        name: 'maps',
        selected: false
      },
      {
        icon: 'assets/img/bar.png',
        name: 'charts',
        selected: false
      },
      {
        icon: 'assets/img/report.png',
        name: 'reports',
        selected: false
      },
      {
        icon: 'assets/img/resource.png',
        name: 'resources',
        selected: false
      },
      {
        icon: 'assets/img/app.png',
        name: 'apps',
        selected: false
      },
    ],
    results: []
  }
};

