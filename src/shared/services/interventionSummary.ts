import { cloneDeep, difference, findIndex, get, uniqBy } from "lodash";
import { BNA_INTERVENTIONS_SUMMARY_INCLUDE_KEYS, BNA_INTERVENTIONS_SUMMARY_KEY, BNA_NAMESPACE } from "../../constants/dataStore";
import { InterventionConfig, InterventionSummary } from "../interfaces/interventionConfig";
import { map, asyncify } from "async-es";

const summaryQuery = {
  summary: {
    resource: `dataStore/${BNA_NAMESPACE}`,
    id: BNA_INTERVENTIONS_SUMMARY_KEY,
  },
};

const bnaKeys = {
  bnaKeys: {
    resource: `dataStore/${BNA_NAMESPACE}`,
  },
};

const bnaConfig = {
  bnaConfig: {
    resource: `dataStore/${BNA_NAMESPACE}`,
    id: ({ id }: any) => id,
  },
};

const initSummaryMutation = {
  resource: `dataStore/${BNA_NAMESPACE}/${BNA_INTERVENTIONS_SUMMARY_KEY}`,
  type: "create",
  data: [],
};

export async function initializeSummaryKey(engine: any) {
  return await engine.mutate(initSummaryMutation);
}

export async function createInterventionSummariesFromIds(interventionId: string[], engine: any) {
  const interventionConfigs: InterventionConfig[] = await map(
    interventionId,
    asyncify(async (id: string) => await engine.query(bnaConfig, { variables: { id } }).then(({ bnaConfig }: { bnaConfig: InterventionConfig }) => bnaConfig))
  );
  return createInterventionSummaries(interventionConfigs);
}

async function generateMissingSummary(engine: any, summary: InterventionSummary[], keys: string[]) {
  const summaryKeys = summary.map(({ id }: InterventionSummary) => id);
  const missingKeys: string[] = difference(keys, summaryKeys);
  const missingSummaries = await createInterventionSummariesFromIds(missingKeys, engine);
  const updatedSummary = [...summary, ...missingSummaries];
  await uploadInterventionSummary(engine, updatedSummary);
  return updatedSummary;
}

export async function getInterventionSummary(engine: any): Promise<Array<InterventionSummary>> {
  try {
    const { summary } = await engine.query(summaryQuery);
    const { bnaKeys: keys } = await engine.query(bnaKeys);
    const bnaConfigKeys = keys.filter((key: string) => !["settings", "savedObjects", "interventions-summary"].includes(key));
    if (summary.length !== bnaConfigKeys.length) {
      //Some keys are missing in the summary, regenerate summary from the existing keys
      return generateMissingSummary(engine, summary, bnaConfigKeys);
    }
    return summary ?? [];
  } catch (e: any) {
    if (e?.details?.httpStatusCode === 404) {
      await initializeSummaryKey(engine);
      return getInterventionSummary(engine);
    }
  }
  return [];
}

export function createInterventionSummary(intervention: InterventionConfig): InterventionSummary {
  const summary: { [key: string]: any } = {};

  for (const detail of BNA_INTERVENTIONS_SUMMARY_INCLUDE_KEYS) {
    summary[detail.key] = get(intervention, detail.path);
  }
  return <InterventionSummary>summary;
}

export function createInterventionSummaries(interventions: Array<InterventionConfig>): Array<InterventionSummary> {
  return interventions.map(createInterventionSummary);
}

export function addInterventionSummary(summary: InterventionSummary, summaries: Array<InterventionSummary>): Array<InterventionSummary> {
  return uniqBy([...summaries, summary], "id");
}

export function addInterventionSummaries(newSummaries: Array<InterventionSummary>, summaries: Array<InterventionSummary>): Array<InterventionSummary> {
  return uniqBy([...summaries, ...newSummaries], "id");
}

export function updateInterventionSummary(summary: InterventionSummary, summaries: Array<InterventionSummary>): Array<InterventionSummary> {
  const updatedSummaries = cloneDeep(summaries);
  const index = findIndex(summaries, { id: summary.id });
  if (index > -1) {
    updatedSummaries[index] = summary;
    return updatedSummaries;
  }
  return summaries;
}

const summaryMutation = {
  resource: `dataStore/${BNA_NAMESPACE}`,
  id: BNA_INTERVENTIONS_SUMMARY_KEY,
  type: "update",
  data: ({ data }: { data: Array<InterventionSummary> }) => data,
};

export async function uploadInterventionSummary(engine: any, summaries: Array<InterventionSummary>) {
  return await engine.mutate(summaryMutation, { variables: { data: summaries } });
}
