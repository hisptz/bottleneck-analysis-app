import { filter } from "lodash";
import { BNA_ARCHIVES_NAMESPACE } from "../../constants/dataStore";
import { Archive } from "../interfaces/archive";
import { InterventionConfig } from "../interfaces/interventionConfig";
import { User } from "../interfaces/user";

export function createArchive({
  intervention,
  user,
  chartAnalytics,
  subLevelAnalytics,
  rootCauseData,
  remarks,
  orgUnit,
  period,
}: {
  intervention: InterventionConfig;
  chartAnalytics: any;
  subLevelAnalytics: any;
  rootCauseData: any;
  user: User;
  remarks: string;
  orgUnit: string;
  period: string;
}): Archive {
  const dateCreated = new Date().toLocaleDateString("en-GB", {}).replaceAll("/", "-");
  const userId = user.id;

  return {
    id: `${intervention.id}_${orgUnit}_${period}_${dateCreated}`,
    user: userId,
    config: intervention,
    remarks,
    chartData: chartAnalytics,
    subLevelData: subLevelAnalytics,
    rootCauseData,
    dateCreated,
    orgUnit,
    period,
  };
}

const generateArchiveMutation = (id: string) => ({
  type: "create",
  resource: `dataStore/${BNA_ARCHIVES_NAMESPACE}/${id}`,
  data: ({ data }: any) => data,
});

export async function uploadArchive(engine: any, archive: Archive) {
  return await engine.mutate(generateArchiveMutation(archive.id), { variables: { data: archive, id: archive.id } });
}

const archiveKeysQuery = {
  archiveKeys: {
    resource: `dataStore/${BNA_ARCHIVES_NAMESPACE}`,
  },
};

export async function getInterventionArchives(engine: any, interventionId: string) {
  const { archiveKeys } = await engine.query(archiveKeysQuery);
  return filter(archiveKeys, (key: string) => key.match(RegExp(interventionId))) as unknown as Array<string>;
}

export const deleteMutation = {
  type: "delete",
  resource: `dataStore/${BNA_ARCHIVES_NAMESPACE}`,
  id: ({ id }: any) => id,
};

export async function deleteArchive(engine: any, id: string) {
  return await engine.mutate(deleteMutation, { variables: { id } });
}
