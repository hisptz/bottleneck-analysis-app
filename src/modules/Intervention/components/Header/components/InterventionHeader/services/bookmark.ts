import { filter, uniq } from "lodash";
import { InterventionSummary } from "../../../../../../../shared/interfaces/interventionConfig";
import { getIntervention } from "../../../../../../../shared/services/getInterventions";
import { createInterventionSummary, updateInterventionSummary } from "../../../../../../../shared/services/interventionSummary";
import { updateIntervention } from "../../../../../../InterventionConfiguration/services/save";

export async function addBookmark(
  engine: any,
  {
    userId,
    interventionId,
    interventionSummaries,
    updateSummary,
  }: {
    userId: string;
    interventionId?: string;
    interventionSummaries: Array<InterventionSummary>;
    updateSummary: (summaries: Array<InterventionSummary>) => void;
  }
): Promise<void> {
  if (!interventionId) {
    return;
  }
  const intervention = await getIntervention(engine, interventionId);
  if (!intervention) {
    return;
  }
  const updatedIntervention = { ...intervention, bookmarks: uniq([...intervention.bookmarks, userId]) };
  updateSummary(updateInterventionSummary(createInterventionSummary(updatedIntervention), interventionSummaries));
  await updateIntervention(engine, updatedIntervention, interventionSummaries);
}

export async function removeBookmark(
  engine: any,
  {
    userId,
    interventionId,
    interventionSummaries,
    updateSummary,
  }: {
    userId: string;
    interventionId?: string;
    interventionSummaries: Array<InterventionSummary>;
    updateSummary: (summaries: Array<InterventionSummary>) => void;
  }
): Promise<void> {
  if (!interventionId) {
    return;
  }
  const intervention = await getIntervention(engine, interventionId);
  if (!intervention) {
    return;
  }
  const updatedIntervention = { ...intervention, bookmarks: filter([...intervention.bookmarks], (value) => value !== userId) };
  updateSummary(updateInterventionSummary(createInterventionSummary(updatedIntervention), interventionSummaries));
  await updateIntervention(engine, updatedIntervention, interventionSummaries);
}
