import { atomFamily } from "recoil";
import { DataItem, Group } from "../../../shared/interfaces/interventionConfig";

export const SelectedDeterminant = atomFamily<Group | undefined, string>({
  key: "selected-determinant",
  default: undefined,
});

export const SelectedIndicator = atomFamily<DataItem | undefined, string>({
  key: "selected-indicator",
  default: undefined,
});
