import { map } from "async";
import { filter } from "lodash";

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
