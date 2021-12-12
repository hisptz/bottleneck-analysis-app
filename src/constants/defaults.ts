import i18n from "@dhis2/d2-i18n";
import { InterventionConfig } from "../shared/interfaces/interventionConfig";
import { uid } from "../shared/utils/generators";

export const DEFAULT_INTERVENTION_CONFIG: InterventionConfig = {
  description: "",
  id: uid(),
  name: "",
  user: {
    id: "",
  },
  bookmarks: [],
  userAccess: [],
  publicAccess: "r-------",
  dataSelection: {
    groups: [
      {
        id: uid(),
        name: i18n.t("Commodities"),
        items: [],
        style: {
          color: "#7DB2E8",
        },
        sortOrder: 1,
      },
      {
        id: uid(),
        name: i18n.t("Human Resources"),
        items: [],
        style: {
          color: "#80CC33",
        },
        sortOrder: 2,
      },
      {
        id: uid(),
        name: i18n.t("Geographic Accessibility"),
        items: [],
        style: {
          color: "#40BF80",
        },
        sortOrder: 3,
      },
      {
        id: uid(),
        name: i18n.t("Initial Utilisation"),
        items: [],
        style: {
          color: "#75F0F0",
        },
        sortOrder: 4,
      },
      {
        id: uid(),
        name: i18n.t("Continuous Utilisation"),
        items: [],
        style: {
          color: "#9485E0",
        },
        sortOrder: 5,
      },
      {
        id: uid(),
        name: i18n.t("Effective Coverage"),
        items: [],
        style: {
          color: "#D98CCC",
        },
        sortOrder: 6,
      },
    ],
    legendDefinitions: [
      {
        id: uid(),
        name: i18n.t("Target achieved / on track"),
        color: "#008000",
        isDefault: false,
      },
      {
        id: uid(),
        name: i18n.t("Progress, but more effort required"),
        color: "#FFFF00",
        isDefault: false,
      },
      {
        id: uid(),
        name: i18n.t("Not on track"),
        color: "#FF0000",
        isDefault: false,
      },
      {
        id: "not-applicable",
        name: i18n.t("N/A"),
        color: "#D3D3D3",
        isDefault: true,
      },
      {
        id: "no-data",
        name: i18n.t("No data"),
        color: "#FFFFFF",
        isDefault: true,
      },
    ],
  },
  externalAccess: false,
  periodSelection: {
    id: `${new Date().getFullYear()}`,
    type: "Yearly",
  },
  userGroupAccess: [],
  orgUnitSelection: {
    orgUnit: {
      id: "USER_ORGUNIT",
    },
    subLevel: undefined,
  },
};
