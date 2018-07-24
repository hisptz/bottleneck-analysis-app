export const DASHBOARD_TYPES: { [name: string]: any } = {
  users: {
    type: 'USERS',
    isArray: true
  },
  reports: {
    type: 'REPORTS',
    isArray: true
  },
  resources: {
    type: 'RESOURCES',
    isArray: true
  },
  apps: {
    type: 'APP',
    isArray: false,
    isWidget: true
  },
  charts: {
    type: 'CHART',
    isArray: false
  },
  eventCharts: {
    type: 'EVENT_CHART',
    isArray: false
  },
  eventReports: {
    type: 'EVENT_REPORT',
    isArray: false
  },
  maps: {
    type: 'MAP',
    isArray: false
  },
  reportTables: {
    type: 'REPORT_TABLE',
    isArray: false
  }
};
