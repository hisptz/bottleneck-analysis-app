export interface Dashboard {
  id: string;
  name: string;
  description: string;
  group: string;
  details: any;
  dashboardItems: any[];
}

export interface DashboardMenuItem {
  id: string;
  name: string;
  details: any;
}

export interface DashboardState {
  currentDashboardPage: number;
  dashboardPageNumber: number;
  dashboardPerPage: number;
  currentDashboard: string;
  dashboardsLoaded: boolean;
  dashboards: Dashboard[];
}

export const INITIAL_DASHBOARD_STATE: DashboardState = {
  currentDashboardPage: 0,
  dashboardPageNumber: 0,
  dashboardPerPage: 8,
  currentDashboard: undefined,
  dashboardsLoaded: false,
  dashboards: []
};

