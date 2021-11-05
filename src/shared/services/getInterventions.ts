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
