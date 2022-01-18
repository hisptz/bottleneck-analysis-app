import { map } from "async";
import { filter, flattenDeep } from "lodash";
import { BNA_NAMESPACE, ROOT_CAUSE_CONFIG_KEY, ROOT_CAUSE_SUFFIX } from "../../../../../constants/dataStore";
import { DEFAULT_ROOT_CAUSE_CONFIG } from "../../../../../constants/defaults";
import { RootCauseDataInterface } from "../interfaces/rootCauseData";

const mutateConfig = {
  resource: `dataStore/${BNA_NAMESPACE}-${ROOT_CAUSE_SUFFIX}/${ROOT_CAUSE_CONFIG_KEY}`,
  type: "create",
  data: ({ data }: any) => data,
};

async function initializeRootCauseConfig(engine: any) {
  return await engine.mutate(mutateConfig, { variables: { data: DEFAULT_ROOT_CAUSE_CONFIG } });
}

const configQuery = {
  config: {
    resource: `dataStore/${BNA_NAMESPACE}-${ROOT_CAUSE_SUFFIX}/${ROOT_CAUSE_CONFIG_KEY}`,
  },
};

export async function getRootCauseConfig(engine: any): Promise<any> {
  try {
    const { config } = await engine.query(configQuery);
    return config;
  } catch (e) {
    await initializeRootCauseConfig(engine);
    return getRootCauseConfig(engine);
  }
}

const rootCauseDataKeys = {
  keys: {
    resource: `dataStore/${BNA_NAMESPACE}-${ROOT_CAUSE_SUFFIX}`,
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
        resource: `dataStore/${BNA_NAMESPACE}-${ROOT_CAUSE_SUFFIX}`,
        id: ({ id }: { id: string }) => id,
      },
    },
    { variables: { id: key } }
  );
  return data;
}

export async function getRootCausesData(engine: any, interventionId: string): Promise<RootCauseDataInterface[]> {
  const keys = await getRootCauseDataKeys(engine);
  const interventionKeys = filter(keys, (key: string) => key.match(RegExp(`${interventionId}_rcadata`)));
  return await map(interventionKeys, async (key: string) => {
    return await getRootCauseDataByKey(engine, key);
  });
}

export async function deleteRootCauseData(engine: any, interventionId: string, rootCauseId: string) {
  try {
    const rcaDataFromStore: RootCauseDataInterface[] = await getRootCausesData(engine, interventionId);
    const sanitizedRcaData = filter(flattenDeep(rcaDataFromStore), (rcaData: RootCauseDataInterface) => rcaData.id !== rootCauseId);
    await saveRootCauseData(engine, `dataStore/${BNA_NAMESPACE}-${ROOT_CAUSE_SUFFIX}/${interventionId}_rcadata`, sanitizedRcaData);
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function addOrUpdateRootCauseData(engine: any, interventionId: string, data: RootCauseDataInterface) {
  try {
    const rcaDataFromStore: RootCauseDataInterface[] = await getRootCausesData(engine, interventionId);
    const dataStoreUrl = `dataStore/${BNA_NAMESPACE}/${interventionId}_rcadata`;
    const filteredRcaData = filter(flattenDeep(rcaDataFromStore), (rcaData: RootCauseDataInterface) => rcaData.id !== data.id);
    const rootCauseDataToSave = flattenDeep([...filteredRcaData, data]);
    await saveRootCauseData(engine, dataStoreUrl, rootCauseDataToSave);
  } catch (error) {
    if (`${error}`.includes("404")) {
      // If the root cause key doesn't exist, create it
      const mutation = {
        resource: `dataStore/${BNA_NAMESPACE}/${interventionId}_rcadata`,
        type: "create",
        data: ({ data }: { data: RootCauseDataInterface }) => data,
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

async function saveRootCauseData(engine: any, dataStoreUrl: string, data: RootCauseDataInterface[]) {
  const mutation = {
    resource: dataStoreUrl,
    type: "update",
    data: ({ data }: { data: any }) => data,
  };
  await engine.mutate(mutation, { variables: { data } });
}

const rootCauseDataMutation = {
  resource: `dataStore/${BNA_NAMESPACE}-${ROOT_CAUSE_SUFFIX}`,
  type: "update",
  id: ({ id }: any) => id,
  data: ({ data }: any) => data,
};

export async function uploadRootCauseData(engine: any, interventionId: string, rootCauseData: Array<RootCauseDataInterface>): Promise<any> {
  const id = `${interventionId}_${ROOT_CAUSE_SUFFIX}`;
  return await engine.mutate(rootCauseDataMutation, { variables: { id, data: rootCauseData } });
}
