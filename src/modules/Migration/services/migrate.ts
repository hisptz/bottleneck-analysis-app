import { compact, find } from "lodash";
import { BNA_NAMESPACE } from "../../../constants/dataStore";
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

export async function migrateIntervention(intervention: InterventionConfig, engine: any) {
  const mutation = generateSaveMutation(intervention.id);
  return await engine.mutate(mutation, { variables: { data: intervention } });
}

function convertData(dataConfig?: GlobalSelection): DataSelection {
  if (dataConfig) {
    const { groups, items, legendDefinitions } = dataConfig;
    const newGroups: Array<Group> = groups.map(({ id, name, color, members, sortOrder }) => {
      const groupItems: Array<DataItem | undefined> = members?.map(({ id, type }: SelectionGroupMember) => {
        const member = find(items, ["id", id]);
        if (member) {
          const { name, legendSet, label } = member;
          return {
            type,
            id,
            name,
            label,
            legends: legendSet?.legends.map(({ id, endValue, startValue }: Legend) => ({ id, endValue, startValue })),
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
    const newLegendDefinitions: Array<LegendDefinition> = legendDefinitions.map(({ id, name, color }) => ({
      id,
      name,
      color,
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
    return {
      orgUnit: { id: oldOrgUnit?.id, type: oldOrgUnit?.type ?? "" },
      subLevelAnalysisOrgUnitLevel: { id: levelOrgUnit?.id, type: levelOrgUnit?.type ?? "" },
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
