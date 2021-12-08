import { cloneDeep, findIndex, set as _set } from "lodash";
import { atomFamily, selectorFamily } from "recoil";
import { DataItem, Group } from "../../../shared/interfaces/interventionConfig";
import { InterventionDirtySelector } from "./data";

export const SelectedDeterminantId = atomFamily<string | undefined, string>({
  key: "selected-determinant-id",
  default: undefined,
});

export const SelectedIndicatorId = atomFamily<string | undefined, string>({
  key: "selected-indicator-id",
  default: undefined,
});

export const SelectedIndicator = selectorFamily<DataItem | undefined, string>({
  key: "selected-indicator",
  get:
    (id: string) =>
    ({ get }) => {
      const selectedIndicatorId = get(SelectedIndicatorId(id));
      const selectedDeterminantId = get(SelectedDeterminantId(id));
      const determinants: Array<Group> = get(InterventionDirtySelector({ id, path: ["dataSelection", "groups"] }));
      const groupIndex = findIndex(determinants, (group) => group.id === selectedDeterminantId);
      const indicatorIndex = findIndex(determinants[groupIndex].items, (item) => item.id === selectedIndicatorId);
      if (indicatorIndex === -1) return undefined;
      return get(
        InterventionDirtySelector({
          id,
          path: ["dataSelection", "groups", groupIndex, "items", indicatorIndex],
        })
      );
    },

  set:
    (id: string) =>
    ({ set, get }, value) => {
      set(InterventionDirtySelector({ id, path: ["dataSelection", "groups"] }), (prevValue) => {
        const selectedIndicatorId = get(SelectedIndicatorId(id));
        const selectedDeterminantId = get(SelectedDeterminantId(id));
        const newValue: Array<Group> = cloneDeep(prevValue);
        const groupIndex = findIndex(newValue, (group) => group.id === selectedDeterminantId);
        const indicatorIndex = findIndex(newValue[groupIndex].items, (item) => item.id === selectedIndicatorId);
        _set(newValue, [groupIndex, "items", indicatorIndex], value);
        return newValue;
      });
    },
});

export const ErrorState = atomFamily({
  key: "intervention-config-error-state",
  default: undefined,
});
