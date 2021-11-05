import { BNA_NAMESPACE } from "../../constants/dataStore";

const keysQuery = {
  keys: {
    resource: `dataStore/${BNA_NAMESPACE}`,
  },
};

export async function getInterventionKeys(engine: any) {
  const { keys } = await engine.query(keysQuery);
  return keys;
}

const interventionQuery = {
  intervention: {
    resource: `dataStore/${BNA_NAMESPACE}`,
    id: ({ id }: { id: string }) => id,
  },
};

export async function getIntervention(engine: any, id: string) {
  const { intervention } = await engine.query(interventionQuery, { variables: { id } });
  return intervention;
}
