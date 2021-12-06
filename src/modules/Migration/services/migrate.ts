import { map, queue } from "async";
import { compact, filter, find, isEmpty, last } from "lodash";
import { BNA_NAMESPACE } from "../../../constants/dataStore";
import {
  DataItem,
  DataSelection,
  Group,
  InterventionConfig,
  InterventionSummary,
  LegendDefinition,
  OrgUnitSelection,
  PeriodSelection,
} from "../../../shared/interfaces/interventionConfig";
import { GlobalSelection, Legend, OldInterventionConfig, SelectionGroupMember } from "../../../shared/interfaces/oldInterventionConfig";
import getOldInterventions from "../../../shared/services/getOldInterventions";

export async function getInterventions(engine: any) {
  const oldInterventions: Array<OldInterventionConfig> = await getOldInterventions(engine);
  return oldInterventions.map(convertIntervention);
}

const generateSaveMutation = (id: string) => {
  return {
    resource: `dataStore/${BNA_NAMESPACE}/${id}`,
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
    const newLegendDefinitions: Array<LegendDefinition> = legendDefinitions?.map(({ id, name, color, startValue, endValue }) => ({
      id,
      name,
      color,
      default: startValue === undefined && endValue === undefined,
    }));

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

function convertPeriod(periodConfig?: GlobalSelection): PeriodSelection {
  if (periodConfig) {
    const oldPeriod = periodConfig.items[0];

    return {
      id: oldPeriod.id,
      type: oldPeriod.type ?? "Yearly",
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
    user: { id: user.id },
    userAccess: userAccesses?.map((userAccess) => ({ id: userAccess.id, access: userAccess.access })),
    userGroupAccess: userGroupAccesses.map((userGroupAccess) => ({
      id: userGroupAccess.id,
      access: userGroupAccess.access,
    })),
    externalAccess,
    periodType: bottleneckPeriodType,
    publicAccess,
    dataSelection: convertData(dataConfig),
    orgUnitSelection: convertOrgUnit(orgUnitConfig),
    periodSelection: convertPeriod(periodConfig),
  };
}

const query = {
  config: {
    resource: "dataStore/rca-config/rcaconfig",
  },
};

export async function getRootCauseConfig(engine: any) {
  const { config } = await engine.query(query);
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

export async function migrateRootCauseData(engine: any, key: string, data: any) {
  const mutation = generateSaveMutation(key);
  return await engine.mutate(mutation, { variables: { data } });
}

function convertRootCauseData(data: any, config: any) {
  const orgUnit = data.dataValues[find(config.dataElements, ["name", "OrgUnit"])?.id];
  const period = data.dataValues[find(config.dataElements, ["name", "Period"])?.id];
  return { ...data, id: `${period}_${orgUnit}` };
}

export async function migrateRootCauses(engine: any, interventions: Array<InterventionSummary>) {
  const config = await getRootCauseConfig(engine);
  const q = queue(async (interventionId: string) => migrateRootCauseDataByIntervention(engine, interventionId, config), 5);
  const interventionIds = interventions.map(({ id }: { id: string }) => id);
  await q.push(interventionIds);
}

export async function migrateRootCauseDataByIntervention(engine: any, interventionId: string, config: any) {
  const rootCauseData = await getRootCausesData(engine, interventionId);
  if (!isEmpty(rootCauseData)) {
    const convertedData = rootCauseData.map((data: any) => convertRootCauseData(data, config));
    return await migrateRootCauseData(engine, `${interventionId}_rcadata`, convertedData);
  }
}
