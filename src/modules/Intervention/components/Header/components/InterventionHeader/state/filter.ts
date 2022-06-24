import { reduce } from "lodash";
import { atomFamily, selectorFamily } from "recoil";

export const FilterActive = selectorFamily<boolean, string>({
  key: "filter-active-state",
  get:
    (id: string) =>
    ({ get }) => {
      const activeFilters = get(ActiveFilters(id));
      return reduce(Object.values(activeFilters), (acc, value) => acc || value, false as boolean);
    },
});

export const ActiveFilters = atomFamily<{ period: boolean; orgUnit: boolean }, string>({
  key: "filter-state",
  default: {
    orgUnit: false,
    period: false,
  },
});
