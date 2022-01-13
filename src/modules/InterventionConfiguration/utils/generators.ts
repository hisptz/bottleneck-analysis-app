import { set } from "lodash";
import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";

export function generateGeneralData(payload: InterventionConfig, data: any) {
  set(payload, "name", data?.name);
  set(payload, "description", data?.description);
  set(payload, "periodSelection", data?.periodSelection);
  set(payload, "orgUnitSelection", data?.orgUnitSelection);
  set(payload, ["dataSelection", "legendDefinitions"], data?.legendDefinitions);
}

export function generateDeterminantData(payload: InterventionConfig, data: any) {
  set(payload, ["dataSelection", "groups"], data?.groups);
}

export function generateAccessData(payload: InterventionConfig, data: any) {
  set(payload, "publicAccess", data?.publicAccess);
  set(payload, "userAccess", data?.userAccess);
  set(payload, "userGroupAccess", data?.userGroupAccess);
}
