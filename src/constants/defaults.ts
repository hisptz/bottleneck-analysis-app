import { InterventionConfig, LegendDefinition } from "../shared/interfaces/interventionConfig";
import { uid } from "../shared/utils/generators";

export const DEFAULT_LEGEND_DEFINITIONS: Array<LegendDefinition> = [];

export const DEFAULT_INTERVENTION_CONFIG: InterventionConfig = {
  id: uid(),
  name: "",
  user: {
    id: "",
  },
  bookmarks: [],
  periodType: "",
  userAccess: [],
  publicAccess: "r-------",
  dataSelection: {
    groups: [
      {
        id: uid(),
        name: "Commodities",
        items: [],
        style: {
          color: "#7DB2E8",
        },
        sortOrder: 1,
      },
      {
        id: uid(),
        name: "Human Resources",
        items: [],
        style: {
          color: "#80CC33",
        },
        sortOrder: 2,
      },
      {
        id: uid(),
        name: "Geographic Accessibility",
        items: [],
        style: {
          color: "#40BF80",
        },
        sortOrder: 3,
      },
      {
        id: uid(),
        name: "Initial Utilisation",
        items: [],
        style: {
          color: "#75F0F0",
        },
        sortOrder: 4,
      },
      {
        id: uid(),
        name: "Continuous Utilisation",
        items: [],
        style: {
          color: "#9485E0",
        },
        sortOrder: 5,
      },
      {
        id: uid(),
        name: "Effective Coverage",
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
        name: "Target achieved / on track",
        color: "#008000",
        default: false,
      },
      {
        id: uid(),
        name: "Progress, but more effort required",
        color: "#FFFF00",
        default: false,
      },
      {
        id: uid(),
        name: "Not on track",
        color: "#FF0000",
        default: false,
      },
      {
        id: uid(),
        name: "N/A",
        color: "#D3D3D3",
        default: true,
      },
      {
        id: uid(),
        name: "No data",
        color: "#FFFFFF",
        default: true,
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
      id: "USER_ORGUNIT_GRANDCHILDREN",
      type: "USER_ORGANISATION_UNIT",
    },
    subLevelAnalysisOrgUnitLevel: {
      id: "",
      type: "",
    },
  },
};
