import { map } from "async-es";
import { BNA_ARCHIVES_NAMESPACE } from "../../../constants/dataStore";
import { Archive } from "../../../shared/interfaces/archive";

const keysQuery = {
  keys: {
    resource: `dataStore/${BNA_ARCHIVES_NAMESPACE}`,
  },
};

const archiveQuery = {
  archive: {
    resource: `dataStore/${BNA_ARCHIVES_NAMESPACE}`,
    id: ({ id }: any) => id,
  },
};

export async function getArchives(engine: any): Promise<Array<Archive>> {
  const { keys } = await engine.query(keysQuery);
  return await map(keys, async (key: string) => await getArchive(engine, key));
}

export async function getArchive(engine: any, id: string): Promise<Archive> {
  const { archive } = await engine.query(archiveQuery, { variables: { id } });
  return archive as unknown as Archive;
}
