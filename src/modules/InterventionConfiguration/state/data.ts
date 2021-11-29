import { get as _get, set as _set } from "lodash";
import { atomFamily, selectorFamily } from "recoil";
import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";
import { InterventionState } from "../../Intervention/state/intervention";

export const InterventionDirtyState = atomFamily<InterventionConfig, string>({
  key: "interventionDirtyState",
  default: selectorFamily({
    key: "interventionDirtySelector",
    get:
      (id: string) =>
      ({ get }) => {
        return get(InterventionState(id));
      },
  }),
});

export const InterventionDirtySelector = selectorFamily<any, { id: string; path: Array<string> }>({
  key: "interventionDirtySelector",
  get:
    ({ id, path }: { id: string; path: Array<string> }) =>
    ({ get }) => {
      const intervention = get(InterventionDirtyState(id));
      return _get(intervention, path);
    },
  set:
    ({ id, path }: { id: string; path: Array<string> }) =>
    ({ set }, newValue) => {
      return set(InterventionDirtyState(id), (prevState) => {
        const newState = { ...prevState };
        _set(newState, path, newValue);
        return newState;
      });
    },
});
