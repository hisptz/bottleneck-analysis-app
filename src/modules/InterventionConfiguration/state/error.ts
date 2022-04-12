import { get as _get, reduce } from "lodash";
import { atomFamily, selectorFamily } from "recoil";

export interface InterventionError {
  general: {
    name?: string;
    description?: string;
    periodType?: string;
    subLevel?: string;
  };
}

export const ErrorState = atomFamily<InterventionError | undefined, string>({
  key: "error-state",
  default: undefined,
});

export const HasErrors = selectorFamily({
  key: "has-error-selector",
  get:
    ({ id, path }: { id: string; path: Array<string> }) =>
    ({ get }) => {
      const errors = _get(get(ErrorState(id)), path);
      return reduce(Object.values(errors), (acc, error) => acc || Boolean(error), false as boolean);
    },
});
