import { map } from "async";
import { compact, filter, find, isEmpty, last } from "lodash";
import { BNA_NAMESPACE, BNA_ROOT_CAUSE_NAMESPACE, ROOT_CAUSE_CONFIG_KEY, ROOT_CAUSE_SUFFIX } from "../../../constants/dataStore";
import {
  DataItem,
  DataSelection,
  Group,
  InterventionConfig,
  LegendDefinition,
  OrgUnitSelection,
  PeriodSelection,
} from "../../../shared/interfaces/interventionConfig";
import { GlobalSelection, Legend, OldInterventionConfig, SelectionGroupMember } from "../../../shared/interfaces/oldInterventionConfig";
import { RootCauseConfigInterface } from "../../../shared/interfaces/rootCause";
import getOldInterventions from "../../../shared/services/getOldInterventions";
import { uid } from "../../../shared/utils/generators";

export async function getInterventions(engine: any) {
  const oldInterventions: Array<OldInterventionConfig> = compact(await getOldInterventions(engine));
  return oldInterventions?.map(convertIntervention) ?? [];
}

const generateSaveMutation = (id: string) => {
  return {
    resource: `dataStore/${BNA_NAMESPACE}/${id}`,
    type: "create",
    data: ({ data }: { data: InterventionConfig }) => data,
  };
};

const generateRootCauseSaveMutation = (id: string) => {
  return {
    resource: `dataStore/${BNA_ROOT_CAUSE_NAMESPACE}/${id}`,
    type: "create",
    data: ({ data }: { data: InterventionConfig }) => data,
  };
};

export async function migrateIntervention(intervention: InterventionConfig, engine: any): Promise<any> {
  const mutation = generateSaveMutation(intervention.id);
  return await engine.mutate(mutation, { variables: { data: intervention } });
}

function convertData(dataConfig?: GlobalSelection): DataSelection {
  if (dataConfig) {
    const { groups, items, legendDefinitions } = dataConfig;
    const newGroups: Array<Group> = groups?.map(({ id, name, color, members, sortOrder }) => {
      const groupItems: Array<DataItem | undefined> = members?.map(({ id, type }: SelectionGroupMember) => {
        const member = find(items, ["id", id]);
        if (member) {
          const { name, legendSet, label } = member ?? { legendSet: [] };
          return {
            type,
            id,
            name,
            label,
            legends: legendSet?.legends?.map(({ id, endValue, startValue }: Legend) => ({ id, endValue, startValue })),
          };
        }
      });
      return {
        id,
        name,
        sortOrder,
        style: { color },
        items: compact(groupItems),
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
        isDefault,
      };
    });

    return {
      groups: newGroups,
      legendDefinitions: newLegendDefinitions,
    };
  }

  return { groups: [], legendDefinitions: [] };
}

function convertOrgUnit(orgUnitConfig?: GlobalSelection): OrgUnitSelection {
  if (orgUnitConfig) {
    const [oldOrgUnit, levelOrgUnit] = orgUnitConfig?.items;

    const level = parseInt(last(levelOrgUnit?.id?.split("-")) ?? "");
    return {
      orgUnit: { id: oldOrgUnit?.id, type: oldOrgUnit?.type },
      subLevel: levelOrgUnit ? { id: levelOrgUnit?.id, level } : undefined,
    };
  }

  return {
    orgUnit: { id: "", type: "" },
  };
}

function convertPeriod(periodType: string, periodConfig?: GlobalSelection): PeriodSelection {
  if (periodConfig) {
    const oldPeriod = periodConfig.items[0];

    return {
      id: oldPeriod?.id,
      type: periodType,
    };
  }
  return {
    id: "",
    type: "Yearly",
  };
}

export function convertIntervention(config: OldInterventionConfig): InterventionConfig {
  const { id, name, bookmarks, user, userAccesses, userGroupAccesses, publicAccess, externalAccess, globalSelections, bottleneckPeriodType } = config;

  const dataConfig = find(globalSelections, ["dimension", "dx"]);
  const periodConfig = find(globalSelections, ["dimension", "pe"]);
  const orgUnitConfig = find(globalSelections, ["dimension", "ou"]);
  return {
    id,
    name,
    bookmarks,
    description: "",
    user: { id: user.id },
    userAccess: userAccesses?.map((userAccess) => ({ id: userAccess.id, access: userAccess.access })),
    userGroupAccess: userGroupAccesses.map((userGroupAccess) => ({
      id: userGroupAccess.id,
      access: userGroupAccess.access,
    })),
    externalAccess,
    publicAccess,
    dataSelection: convertData(dataConfig),
    orgUnitSelection: convertOrgUnit(orgUnitConfig),
    periodSelection: convertPeriod(bottleneckPeriodType, periodConfig),
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
}

const oldConfigQuery = {
  config: {
    resource: "dataStore/rca-config/rcaconfig",
  },
};

export async function getOldRootCauseConfig(engine: any) {
  const { config } = await engine.query(oldConfigQuery);
  return config;
}

const rootCauseDataKeys = {
  keys: {
    resource: "dataStore/rca-data",
  },
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
        id: ({ id }: { id: string }) => id,
      },
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
  const rootCauseData = await getRootCausesData(engine, interventionId);
  if (!isEmpty(rootCauseData)) {
    const convertedData = rootCauseData.map((data: any) => convertRootCauseData(data, config));
    return await migrateRootCauseData(engine, `${interventionId}_${ROOT_CAUSE_SUFFIX}`, convertedData);
  }
}
