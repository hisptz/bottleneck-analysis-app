export const BNA_NAMESPACE = "hisptz-bna";
export const BNA_INTERVENTIONS_NAMESPACE = "bna-intervention";
export const BNA_DASHBOARDS_NAMESPACE = "dashboards";
export const BNA_DASHBOARDS_PREFIX = "bna-dashboard_";
export const BNA_INTERVENTIONS_SUMMARY_KEY = "interventions-summary";
export const ROOT_CAUSE_SUFFIX = "rcadata";
export const BNA_ARCHIVES_NAMESPACE = "hisptz-bna-archives";
export const ROOT_CAUSE_CONFIG_KEY = "rcaconfig";
export const DATA_MIGRATION_CHECK = "skipMigration";
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
  {
    key: "orgUnitSelection",
    path: "orgUnitSelection",
  },
  {
    key: "periodSelection",
    path: "periodSelection",
  },
];
export const BNA_ROOT_CAUSE_NAMESPACE = `${BNA_NAMESPACE}-${ROOT_CAUSE_SUFFIX}`;
