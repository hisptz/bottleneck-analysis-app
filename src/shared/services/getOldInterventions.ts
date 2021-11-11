import { map } from "async";
import { filter } from "lodash";
import { BNA_DASHBOARDS_NAMESPACE, BNA_DASHBOARDS_PREFIX } from "../../constants/dataStore";
import { OldInterventionConfig } from "../interfaces/oldInterventionConfig";

const keyQuery = {
  dashboardKeys: {
    resource: "dataStore",
    id: BNA_DASHBOARDS_NAMESPACE,
  },
};

export async function getOldInterventionKeys(engine: any): Promise<Array<string>> {
  try {
    const response = await engine.query(keyQuery);
    return filter(response.dashboardKeys ?? [], (key: string) => key.startsWith(BNA_DASHBOARDS_PREFIX));
  } catch (e) {
    // @ts-ignore
    return [];
  }
}

const dashboardQuery = {
  dashboard: {
    resource: `dataStore/${BNA_DASHBOARDS_NAMESPACE}`,
    id: ({ id }: { id: string }) => id,
  },
};

export default async function getOldInterventions(engine: any, keys?: Array<string>): Promise<Array<OldInterventionConfig>> {
  async function getOldIntervention(key: string): Promise<OldInterventionConfig | undefined> {
    try {
      const response = await engine.query(dashboardQuery, { variables: { id: key } });
      return response?.dashboard;
    } catch (e) {
      // @ts-ignore
    }
  }
  if (!keys) {
    keys = await getOldInterventionKeys(engine);
  }
  return await map(keys, getOldIntervention);
}
