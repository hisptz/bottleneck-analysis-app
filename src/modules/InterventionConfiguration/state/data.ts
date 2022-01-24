import { cloneDeep, get as _get, set as _set } from "lodash";
import { atomFamily, selectorFamily } from "recoil";
import { DEFAULT_INTERVENTION_CONFIG } from "../../../constants/defaults";
import { UserState } from "../../../core/state/user";
import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";
import { InterventionState } from "../../Intervention/state/intervention";

export const InterventionDirtyState = atomFamily<InterventionConfig | undefined, string>({
  key: "intervention-dirty-state",
  default: selectorFamily({
    key: "intervention-dirty-state-default",
    get:
      (id?: string) =>
      ({ get }) => {
        if (id) {
          return get(InterventionState(id));
        }
        const user = get(UserState);
        return { ...DEFAULT_INTERVENTION_CONFIG, user: { id: user.id } };
      },
  }),
});

export const InterventionDirtySelector = selectorFamily<any, { id: string; path: Array<string | number> }>({
  key: "interventionDirtySelector",
  get:
    ({ id, path }: { id?: string; path: Array<string | number> }) =>
      ({ get }) => {
        const intervention = get(InterventionDirtyState(id));
        return _get(intervention, path);
      },
  set:
    ({ id, path }: { id: string; path: Array<string | number> }) =>
      ({ set }, newValue) => {
        return set(InterventionDirtyState(id), (prevState) => {
          const newState = cloneDeep(prevState);
          _set(newState ?? {}, path, newValue);
          return newState;
        });
      },
});
