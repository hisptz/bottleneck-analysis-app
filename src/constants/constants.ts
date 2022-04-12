/**
 * Access types
 */
import i18n from "@dhis2/d2-i18n";

export const ACCESS_NONE = {
  value: "--------",
  label: i18n.t("No Access"),
};
export const ACCESS_VIEW_ONLY = {
  value: "r-------",
  label: i18n.t("View Only"),
};
export const ACCESS_VIEW_AND_EDIT = {
  value: "rw------",
  label: i18n.t("View and Edit"),
};

export const ACCESS_TYPES = [ACCESS_NONE, ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT];

/**
 * Sharing targets
 */

export const SHARE_TARGET_EXTERNAL = "SHARE_TARGET_EXTERNAL";
export const SHARE_TARGET_PUBLIC = "SHARE_TARGET_PUBLIC";
export const SHARE_TARGET_USER = "SHARE_TARGET_USER";
export const SHARE_TARGET_GROUP = "SHARE_TARGET_GROUP";

/**
 * Sharing dialog types
 */

export const VISUALIZATION = "visualization";
export const DASHBOARD = "dashboard";

// indicators per determinant

export const INDICATORS_PER_DETERMINANT = 3;
