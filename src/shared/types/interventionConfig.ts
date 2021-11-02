export type DashboardItem = {
  type: "CHART" | "REPORT_TABLE" | "APP";
  shape: "FULL_WIDTH";
};

export type InterventionConfig = {
  name: string;
  id: string;
  dashboardItems: Array<DashboardItem>;
};
