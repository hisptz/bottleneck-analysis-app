import { map } from "async-es";
import { BNA_NAMESPACE } from "../../constants/dataStore";
import { InterventionConfig } from "../interfaces/interventionConfig";

const keysQuery = {
  keys: {
    resource: `dataStore/${BNA_NAMESPACE}`,
  },
};

export async function getInterventionKeys(engine: any): Promise<Array<string>> {
  try {
    const response = await engine.query(keysQuery);
    return response.keys ?? [];
  } catch (e) {
    return [];
  }
}

const interventionQuery = {
  intervention: {
    resource: `dataStore/${BNA_NAMESPACE}`,
    id: ({ id }: { id: string }) => id,
  },
};

export default async function getInterventions(engine: any) {
  async function getIntervention(key: string): Promise<InterventionConfig | undefined> {
    try {
      const response = await engine.query(interventionQuery, { variables: { id: key } });
      return response.intervention;
    } catch (e) {
      console.error(e);
    }
  }

  const keys = await getInterventionKeys(engine);
  return await map(keys, getIntervention);
}

export async function getIntervention(engine: any, id: string) {
  try {
    const { intervention } = await engine.query(interventionQuery, { variables: { id } });
    return intervention;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
