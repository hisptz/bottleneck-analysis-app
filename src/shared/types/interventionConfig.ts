export type DashboardItem = {
  type: "CHART" | "REPORT_TABLE" | "APP";
  shape: "FULL_WIDTH";
  chart?: { id: string };
  reportTable?: { id: string };
  appKey?: string;
};

export type InterventionConfig = {
  name: string;
  id: string;
  dashboardItems: Array<DashboardItem>;
};
