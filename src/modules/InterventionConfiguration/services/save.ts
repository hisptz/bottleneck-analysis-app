import { BNA_NAMESPACE, BNA_ROOT_CAUSE_NAMESPACE, ROOT_CAUSE_SUFFIX } from "../../../constants/dataStore";
import { InterventionConfig, InterventionSummary } from "../../../shared/interfaces/interventionConfig";
import { addInterventionSummary, createInterventionSummary, updateInterventionSummary, uploadInterventionSummary } from "../../../shared/services/interventionSummary";

const mutation = {
  resource: `dataStore/${BNA_NAMESPACE}`,
  type: "update",
  id: ({ id }: any) => id,
  data: ({ data }: any) => data,
};

export async function updateIntervention(engine: any, intervention: InterventionConfig, summaries: Array<InterventionSummary>): Promise<any> {
  return await engine.mutate(mutation, { variables: { id: intervention.id, data: intervention } }).then(async () => {
    const summary = createInterventionSummary(intervention);
    const updatedSummaries = updateInterventionSummary(summary, summaries);
    await uploadInterventionSummary(engine, updatedSummaries);
  });
}

const generateCreateMutation = (id: string) => {
  return {
    resource: `dataStore/${BNA_NAMESPACE}/${id}`,
    type: "create",
    data: ({ data }: any) => data,
  };
};
const generateCreateRootCauseMutation = (id: string) => {
  return {
    resource: `dataStore/${BNA_ROOT_CAUSE_NAMESPACE}/${id}_${ROOT_CAUSE_SUFFIX}`,
    type: "create",
    data: [],
  };
};

export async function createIntervention(engine: any, intervention: InterventionConfig, summaries: Array<InterventionSummary>): Promise<any> {
  return await engine.mutate(generateCreateMutation(intervention?.id), { variables: { data: intervention } }).then(async () => {
    const summary = createInterventionSummary(intervention);
    const updatedSummaries = addInterventionSummary(summary, summaries);
    await uploadInterventionSummary(engine, updatedSummaries);
    await engine.mutate(generateCreateRootCauseMutation(intervention?.id));
  });
}
