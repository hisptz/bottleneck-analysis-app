export const BNA_NAMESPACE = "hisptz-bna";
export const BNA_INTERVENTIONS_NAMESPACE = "bna-intervention";
export const BNA_DASHBOARDS_NAMESPACE = "dashboards";
export const BNA_DASHBOARDS_PREFIX = "bna-dashboard_";
export const BNA_INTERVENTIONS_SUMMARY_KEY = "interventions-summary";
export const BNA_INTERVENTIONS_SUMMARY_INCLUDE_KEYS: Array<{ key: string; path: string }> = [
  {
    key: "id",
    path: "id",
  },
  {
    key: "name",
    path: "name",
  },
  {
    key: "user",
    path: "user",
  },
  {
    key: "publicAccess",
    path: "publicAccess",
  },
  {
    key: "userAccess",
    path: "userAccess",
  },
  {
    key: "externalAccess",
    path: "externalAccess",
  },
  {
    key: "userGroupAccess",
    path: "userGroupAccess",
  },
  {
    key: "bookmarks",
    path: "bookmarks",
  },
];
