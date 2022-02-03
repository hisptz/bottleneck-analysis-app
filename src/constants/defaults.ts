import i18n from "@dhis2/d2-i18n";
import { InterventionConfig } from "../shared/interfaces/interventionConfig";
import { RootCauseConfigInterface } from "../shared/interfaces/rootCause";
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
  map: {
    enabled: true,
    coreLayers: {
      boundaryLayer: { enabled: true },
      thematicLayers: [
        {
          enabled: true,
          indicator: "",
          type: "choropleth",
        },
        {
          enabled: true,
          indicator: "",
          type: "bubble",
        },
      ],
      facilityLayer: { enabled: true },
    },
  },
};

export const DEFAULT_ROOT_CAUSE_CONFIG: RootCauseConfigInterface = {
  id: "rcaconfig",
  name: "Root Cause Analysis Widget",
  dataElements: [
    {
      id: "pQtxdfQ6Jum",
      name: "OrgUnit",
      valueType: "AUTO_FILLED",
      routerParam: {
        key: "name",
        namespace: "orgUnit",
      },
      optionSetValue: false,
      columnMandatory: false,
    },
    {
      id: "qOvrGMTGBee",
      name: "orgUnitId",
      isHidden: true,
      valueType: "AUTO_FILLED",
      routerParam: {
        key: "id",
        namespace: "orgUnit",
      },
      optionSetValue: false,
      columnMandatory: false,
    },
    {
      id: "yzYKWac02lm",
      name: "Period",
      valueType: "AUTO_FILLED",
      routerParam: {
        key: "name",
        namespace: "period",
      },
      optionSetValue: false,
      columnMandatory: false,
    },
    {
      id: "skBBrbmML4S",
      name: "periodId",
      isHidden: true,
      valueType: "AUTO_FILLED",
      routerParam: {
        key: "id",
        namespace: "period",
      },
      optionSetValue: false,
      columnMandatory: false,
    },
    {
      id: "YPfJQu6sCSZ",
      name: "Intervention",
      valueType: "AUTO_FILLED",
      routerParam: {
        key: "name",
        namespace: "dashboard",
      },
      optionSetValue: false,
      columnMandatory: false,
    },
    {
      id: "GXqfW1B2McT",
      name: "interventionId",
      isHidden: true,
      valueType: "AUTO_FILLED",
      routerParam: {
        key: "id",
        namespace: "dashboard",
      },
      optionSetValue: false,
      columnMandatory: false,
    },
    {
      id: "fZCEB7Euppr",
      name: "Bottleneck",
      valueType: "TEXT",
      associatedId: "xf7L8ioFiC5",
      optionSetValue: true,
      columnMandatory: false,
    },
    {
      id: "xf7L8ioFiC5",
      name: "bottleneckId",
      isGroup: true,
      isHidden: true,
      valueType: "TEXT",
      optionSetValue: true,
      columnMandatory: false,
    },
    {
      id: "gE2BDDC0e0V",
      name: "Indicator",
      parentId: "xf7L8ioFiC5",
      valueType: "TEXT",
      associatedId: "oMCl2j0dIlN",
      optionSetValue: true,
      columnMandatory: true,
    },
    {
      id: "oMCl2j0dIlN",
      name: "indicatorId",
      isHidden: true,
      parentId: "xf7L8ioFiC5",
      valueType: "TEXT",
      optionSetValue: true,
      columnMandatory: true,
    },
    {
      id: "HwElwZJ9Oyc",
      name: "Root cause",
      valueType: "TEXT",
      optionSetValue: false,
      columnMandatory: false,
    },
    {
      id: "PS29TQkElZL",
      name: "Solution",
      valueType: "TEXT",
      optionSetValue: false,
      columnMandatory: false,
    },
  ],
};
