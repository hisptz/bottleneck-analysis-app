import { map } from "async";
import { filter, flattenDeep } from "lodash";
import { BNA_NAMESPACE } from "../../../../../constants/dataStore";
import { RootCauseData } from "../interfaces/rootCauseData";

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
    resource: `dataStore/${BNA_NAMESPACE}`,
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
        resource: `dataStore/${BNA_NAMESPACE}`,
        id: ({ id }: { id: string }) => id,
      },
    },
    { variables: { id: key } }
  );
  return data;
}

export async function getRootCausesData(engine: any, interventionId: string): Promise<RootCauseData[]> {
  const keys = await getRootCauseDataKeys(engine);
  const interventionKeys = filter(keys, (key: string) => key.match(RegExp(`${interventionId}_rcadata`)));
  return await map(interventionKeys, async (key: string) => {
    return await getRootCauseDataByKey(engine, key);
  });
}

export async function deleteRootCauseData(engine: any, interventionId: string, rootCauseId: string) {
  try {
    const rcaDataFromStore: RootCauseData[] = await getRootCausesData(engine, interventionId);
    const sanitizedRcaData = filter(rcaDataFromStore, (rcaData: RootCauseData) => rcaData.id !== rootCauseId);
    await saveRootCauseData(engine, `dataStore/${BNA_NAMESPACE}`, sanitizedRcaData);
  } catch (error) {
    throw new Error(`${error}`);
  }
}
export async function addOrUpdateRootCauseData(engine: any, interventionId: string, data: RootCauseData) {
  try {
    const rcaDataFromStore: RootCauseData[] = await getRootCausesData(engine, interventionId);
    const dataStoreUrl = `dataStore/${BNA_NAMESPACE}/${interventionId}_rcadata`;
    const filteredRcaData = filter(flattenDeep(rcaDataFromStore), (rcaData: RootCauseData) => rcaData.id !== data.id);
    const rootCauseDataToSave = flattenDeep([...filteredRcaData, data]);
    await saveRootCauseData(engine, dataStoreUrl, rootCauseDataToSave);
  } catch (error) {
    if (`${error}`.includes("404")) {
      // If the root cause key doesn't exist, create it
      const mutation = {
        resource: `dataStore/${BNA_NAMESPACE}/${interventionId}_rcadata`,
        type: "create",
        data: ({ data }: { data: RootCauseData }) => data,
      };
      try {
        await engine.mutate(mutation, { variables: { data: [data] } });
      } catch (e) {
        throw new Error(`${e}`);
      }
    }
    throw new Error(`${error}`);
  }
}

async function saveRootCauseData(engine: any, dataStoreUrl: string, data: RootCauseData[]) {
  const mutation = {
    resource: dataStoreUrl,
    type: "update",
    data: ({ data }: { data: any }) => data,
  };
  await engine.mutate(mutation, { variables: { data } });
}
