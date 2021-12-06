import { cloneDeep, findIndex, get, uniqBy } from "lodash";
import { BNA_INTERVENTIONS_SUMMARY_INCLUDE_KEYS, BNA_INTERVENTIONS_SUMMARY_KEY, BNA_NAMESPACE } from "../../constants/dataStore";
import { InterventionConfig, InterventionSummary } from "../interfaces/interventionConfig";

const summaryQuery = {
  summary: {
    resource: `dataStore/${BNA_NAMESPACE}`,
    id: BNA_INTERVENTIONS_SUMMARY_KEY,
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

export async function getInterventionSummary(engine: any): Promise<Array<InterventionSummary> | undefined> {
  try {
    const { summary } = await engine.query(summaryQuery);
    return summary;
  } catch (e) {
    // @ts-ignore
    if (e?.details?.httpStatusCode === 404) {
      await initializeSummaryKey(engine);
      return getInterventionSummary(engine);
    }
  }
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
