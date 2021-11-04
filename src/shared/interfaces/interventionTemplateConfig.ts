export interface DashboardItem {
  interface: "CHART" | "REPORT_TABLE" | "APP";
  shape: "FULL_WIDTH";
  chart?: { id: string };
  reportTable?: { id: string };
  appKey?: string;
}

export interface InterventionTemplateConfig {
  name: string;
  id: string;
  dashboardItems: Array<DashboardItem>;
}
