import { filter } from "lodash";
import { BNA_DASHBOARDS_NAMESPACE, BNA_DASHBOARDS_PREFIX } from "../../constants/dataStore";
import { OldInterventionConfig } from "../interfaces/oldInterventionConfig";

const keyQuery = {
  interventionKeys: {
    resource: "dataStore",
    id: BNA_DASHBOARDS_NAMESPACE,
  },
};

export async function getOldInterventionKeys(engine: any): Promise<Array<string>> {
  try {
    const response = await engine.query(keyQuery);
    return filter(response.interventionKeys ?? [], (key: string) => key.startsWith(BNA_DASHBOARDS_PREFIX));
  } catch (e) {
    // @ts-ignore
    return [];
  }
}

const interventionQuery = {
  intervention: {
    resource: `dataStore/${BNA_DASHBOARDS_NAMESPACE}`,
    id: ({ id }: { id: string }) => id,
  },
};

export default async function getOldInterventions(engine: any, keys?: Array<string>): Promise<(OldInterventionConfig | undefined)[]> {
  async function getOldIntervention(key: string): Promise<OldInterventionConfig | undefined> {
    try {
      const response = await engine.query(interventionQuery, { variables: { id: key } });
      return response?.intervention;
    } catch (e) {
      // @ts-ignore
      console.error("Error getting previous intervention", e);
    }
  }

  if (!keys) {
    keys = await getOldInterventionKeys(engine);
  }
  return await Promise.all(keys.map(getOldIntervention));
}
