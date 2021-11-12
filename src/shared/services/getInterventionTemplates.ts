import { map } from "async";
import { BNA_INTERVENTIONS_NAMESPACE } from "../../constants/dataStore";
import { InterventionTemplateConfig } from "../interfaces/interventionTemplateConfig";

const keyQuery = {
  interventionKeys: {
    resource: "dataStore",
    id: BNA_INTERVENTIONS_NAMESPACE,
  },
};

async function getInterventionTemplateKeys(engine: any): Promise<Array<string>> {
  try {
    const response = await engine.query(keyQuery);
    return response.interventionKeys ?? [];
  } catch (e) {
    // @ts-ignore
    return [];
  }
}

const interventionQuery = {
  intervention: {
    resource: `dataStore/${BNA_INTERVENTIONS_NAMESPACE}`,
    id: ({ id }: { id: string }) => id,
  },
};

export default async function getInterventionTemplates(engine: any) {
  async function getIntervention(key: string): Promise<InterventionTemplateConfig | undefined> {
    try {
      const response = await engine.query(interventionQuery, { variables: { id: key } });
      return response.intervention;
    } catch (e) {
      // @ts-ignore
    }
  }
  const keys = await getInterventionTemplateKeys(engine);
  return await map(keys, getIntervention);
}
