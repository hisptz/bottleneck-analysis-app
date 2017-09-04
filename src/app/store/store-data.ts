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
        title: 'All',
        selected: true
      },
      {
        icon: 'assets/img/users.png',
        name: 'users',
        title: 'Users',
        selected: false
      },
      {
        icon: 'assets/img/table.png',
        name: 'tables',
        title: 'Tables',
        selected: false
      },
      {
        icon: 'assets/img/map.png',
        name: 'maps',
        title: 'Maps',
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
        title: 'Reports',
        selected: false
      },
      {
        icon: 'assets/img/resource.png',
        name: 'resources',
        title: 'Resources',
        selected: false
      },
      {
        icon: 'assets/img/app.png',
        name: 'apps',
        title: 'Apps',
        selected: false
      },
    ],
    results: []
  }
};

