import { cloneDeep, findIndex, uniqBy } from "lodash";
import { RootCauseDataInterface } from "../../../interfaces/rootCauseData";

export function addRootCause(newRootCause: RootCauseDataInterface, rootCauses: Array<RootCauseDataInterface>): Array<RootCauseDataInterface> {
  return uniqBy([newRootCause, ...rootCauses], "id");
}
export function updateRootCause(updatedRootCause: RootCauseDataInterface, rootCauses: Array<RootCauseDataInterface>): Array<RootCauseDataInterface> {
  const rootCauseIndex = findIndex(rootCauses, ["id", updatedRootCause.id]);
  if (rootCauseIndex !== undefined) {
    const updatedRootCauses: Array<RootCauseDataInterface> = cloneDeep(rootCauses);
    updatedRootCauses.splice(rootCauseIndex, 1, updatedRootCause);
    return updatedRootCauses;
  }
  return rootCauses;
}
export function deleteRootCause(deletedRootCauseId: string, rootCauses: Array<RootCauseDataInterface>): Array<RootCauseDataInterface> {
  const rootCauseIndex = findIndex(rootCauses, ["id", deletedRootCauseId]);
  if (rootCauseIndex !== undefined) {
    const updatedRootCauses: Array<RootCauseDataInterface> = cloneDeep(rootCauses);
    updatedRootCauses.splice(rootCauseIndex, 1);
    return updatedRootCauses;
  }
  return rootCauses;
}
