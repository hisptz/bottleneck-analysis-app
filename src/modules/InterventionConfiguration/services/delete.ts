import { BNA_NAMESPACE, ROOT_CAUSE_SUFFIX } from "../../../constants/dataStore";
import { InterventionSummary } from "../../../shared/interfaces/interventionConfig";
import { uploadInterventionSummary } from "../../../shared/services/interventionSummary";

const deleteMutation = {
  resource: `dataStore/${BNA_NAMESPACE}`,
  type: "delete",
  id: ({ id }: any) => id,
};

export default async function deleteIntervention(engine: any, interventionId: string, summaries: Array<InterventionSummary>): Promise<void> {
  const newSummaries = summaries.filter((summary: InterventionSummary) => summary.id !== interventionId);
  await engine.mutate(deleteMutation, { variables: { id: interventionId } });
  await engine.mutate(deleteMutation, { variables: { id: `${interventionId}_${ROOT_CAUSE_SUFFIX}` } });
  await uploadInterventionSummary(engine, newSummaries);
}
