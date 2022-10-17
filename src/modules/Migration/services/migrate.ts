import { map } from "async";
import { camelCase, compact, filter, find, isEmpty, last } from "lodash";
import { BNA_NAMESPACE, BNA_ROOT_CAUSE_NAMESPACE, ROOT_CAUSE_CONFIG_KEY, ROOT_CAUSE_SUFFIX } from "../../../constants/dataStore";
import {
  DataItem,
  DataSelection,
  Group,
  InterventionConfig,
  LegendDefinition,
  OrgUnitSelection,
  PeriodSelection
} from "../../../shared/interfaces/interventionConfig";
import { GlobalSelection, Legend, OldInterventionConfig, SelectionGroupMember } from "../../../shared/interfaces/oldInterventionConfig";
import { RootCauseConfigInterface } from "../../../shared/interfaces/rootCause";
import { uid } from "../../../shared/utils/generators";
import { CustomFunction } from "../../../shared/interfaces/customFunctions";
import { INTERVENTION_DATA_TYPES } from "../../../constants/intervention";
import { isOrgUnitId } from "../../../shared/utils/orgUnit";

const customFunctionKeys = {
  customFunctionKeys: {
    resource: "dataStore/functions"
  }
};

const customFunctionQuery = {
  customFunction: {
    resource: "dataStore/functions",
    id: ({ id }: any) => id
  }
};

export async function getAllCustomFunctions(engine: any) {
  const { customFunctionKeys: keys } = (await engine.query(customFunctionKeys)) ?? { customFunctionKeys: [] };
  if (isEmpty(keys)) {
    return [];
  }
  return await map(keys, async (key: string) => {
    try {
      const { customFunction } = await engine.query(customFunctionQuery, { variables: { id: key } });
      return customFunction;
    } catch (e) {
      return null;
    }
  });
}

const generateSaveMutation = (id: string) => {
  return {
    resource: `dataStore/${BNA_NAMESPACE}/${id}`,
    type: "create",
    data: ({ data }: { data: InterventionConfig }) => data
  };
};

const generateRootCauseSaveMutation = (id: string) => {
  return {
    resource: `dataStore/${BNA_ROOT_CAUSE_NAMESPACE}/${id}`,
    type: "create",
    data: ({ data }: { data: InterventionConfig }) => data
  };
};

export async function migrateIntervention(intervention: InterventionConfig, engine: any): Promise<any> {
  const mutation = generateSaveMutation(intervention.id);
  return await engine.mutate(mutation, { variables: { data: intervention } });
}

function convertData(customFunctions: Array<CustomFunction>, dataConfig?: GlobalSelection): DataSelection {
  if (dataConfig) {
    const { groups, items, legendDefinitions } = dataConfig;
    const newGroups: Array<Group> = groups?.map(({ id, name, color, members, sortOrder }) => {
      const groupItems: Array<DataItem | undefined> = members?.map(({ id, type }: SelectionGroupMember) => {
        const member = find(items, ["id", id]);
        let newId = id;
        if (type === "FUNCTION_RULE") {
          const customFunction: CustomFunction | undefined = find(customFunctions ?? [], (customFunction: CustomFunction) => {
            return find(customFunction.rules, (rule: any) => rule.id === id);
          }) as CustomFunction;

          if (customFunction) {
            newId = `${customFunction.id}.${id}`;
          }
        }

        if (member) {
          const { name, legendSet, label } = member ?? { legendSet: [] };
          return {
            type: type === "FUNCTION_RULE" ? INTERVENTION_DATA_TYPES.CUSTOM_FUNCTION : type,
            id: newId,
            name,
            label: label ?? name,
            legends: legendSet?.legends?.map(({ id, endValue, startValue }: Legend) => ({ id, endValue, startValue }))
          };
        }
      });
      return {
        id,
        name,
        sortOrder,
        style: { color },
        items: compact(groupItems),
        code: camelCase(name)
      };
    });
    const newLegendDefinitions: Array<LegendDefinition> = legendDefinitions?.map(({ id, name, color, default: isDefault }: Legend) => {
      const getId = () => {
        if (isDefault) {
          if (name.match(RegExp("N/A"))) {
            return "not-applicable";
          } else {
            return "no-data";
          }
        }
        return id;
      };
      return {
        id: getId(),
        name,
        color,
        isDefault
      };
    });

    return {
      groups: newGroups,
      legendDefinitions: newLegendDefinitions
    };
  }

  return { groups: [], legendDefinitions: [] };
}

function convertOrgUnit(orgUnitConfig?: GlobalSelection): OrgUnitSelection {
  if (orgUnitConfig) {
    const [oldOrgUnit, levelOrgUnit] = orgUnitConfig?.items;

    const level = parseInt(last(levelOrgUnit?.id?.split("-")) ?? "");

    return {
      orgUnit: { id: isOrgUnitId(oldOrgUnit?.id) ? oldOrgUnit?.id : "USER_ORGUNIT", type: oldOrgUnit?.type },
      subLevel: levelOrgUnit ? { id: levelOrgUnit?.id, level } : undefined
    };
  }

  return {
    orgUnit: { id: "", type: "" }
  };
}

function convertPeriod(periodType: string, periodConfig?: GlobalSelection): PeriodSelection {
  if (periodConfig) {
    const oldPeriod = periodConfig.items[0];

    return {
      id: oldPeriod?.id,
      type: periodType
    };
  }
  return {
    id: "",
    type: "Yearly"
  };
}

export function convertIntervention(config: OldInterventionConfig, customFunctions: Array<CustomFunction>): InterventionConfig {
  const {
    id,
    name,
    bookmarks,
    user,
    userAccesses,
    userGroupAccesses,
    publicAccess,
    externalAccess,
    globalSelections,
    bottleneckPeriodType
  } = config;

  const dataConfig = find(globalSelections, ["dimension", "dx"]);
  const periodConfig = find(globalSelections, ["dimension", "pe"]);
  const orgUnitConfig = find(globalSelections, ["dimension", "ou"]);
  return {
    id,
    name,
    bookmarks: bookmarks ?? [],
    description: "",
    user: { id: user.id },
    userAccess: userAccesses?.map((userAccess) => ({ id: userAccess.id, access: userAccess.access })),
    userGroupAccess: userGroupAccesses.map((userGroupAccess) => ({
      id: userGroupAccess.id,
      access: userGroupAccess.access
    })),
    externalAccess,
    publicAccess,
    dataSelection: convertData(customFunctions, dataConfig),
    orgUnitSelection: convertOrgUnit(orgUnitConfig),
    periodSelection: convertPeriod(bottleneckPeriodType, periodConfig),
    map: {
      enabled: false,
      coreLayers: {
        boundaryLayer: { enabled: true },
        thematicLayers: [],
        facilityLayer: { enabled: true, style: { icon: "01.png" } }
      }
    }
  };
}

const oldConfigQuery = {
  config: {
    resource: "dataStore/rca-config/rcaconfig"
  }
};

export async function getOldRootCauseConfig(engine: any) {
  const { config } = await engine.query(oldConfigQuery);
  return config;
}

const rootCauseDataKeys = {
  keys: {
    resource: "dataStore/rca-data"
  }
};

async function getRootCauseDataKeys(engine: any) {
  const { keys } = await engine.query(rootCauseDataKeys);
  return keys;
}

async function getRootCauseDataByKey(engine: any, key: string) {
  const { data } = await engine.query(
    {
      data: {
        resource: `dataStore/rca-data`,
        id: ({ id }: { id: string }) => id
      }
    },
    { variables: { id: key } }
  );
  return data;
}

export async function getRootCausesData(engine: any, interventionId: string) {
  const keys = await getRootCauseDataKeys(engine);
  const interventionKeys = filter(keys, (key: string) => key.match(RegExp(interventionId)));
  return await map(interventionKeys, async (key: string) => {
    return await getRootCauseDataByKey(engine, key);
  });
}

export async function migrateRootCauseConfig(engine: any, config: RootCauseConfigInterface) {
  const mutation = generateSaveMutation(ROOT_CAUSE_CONFIG_KEY);
  return await engine.mutate(mutation, { variables: { data: config } });
}

export async function migrateRootCauseData(engine: any, key: string, data: any) {
  const mutation = generateRootCauseSaveMutation(key);
  return await engine.mutate(mutation, { variables: { data } });
}

function convertRootCauseData(data: any, config: any) {
  const orgUnit = data.dataValues[find(config.dataElements, ["name", "orgUnitId"])?.id];
  const period = data.dataValues[find(config.dataElements, ["name", "periodId"])?.id];
  return { ...data, id: `${period}_${orgUnit}_${uid()}` };
}

export async function migrateRootCauseDataByIntervention(engine: any, interventionId: string, config: any) {
  const rootCauseData = (await getRootCausesData(engine, interventionId)) ?? [];
  const convertedData = rootCauseData?.map((data: any) => convertRootCauseData(data, config)) ?? [];
  return await migrateRootCauseData(engine, `${interventionId}_${ROOT_CAUSE_SUFFIX}`, convertedData);
}
