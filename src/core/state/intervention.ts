import { find } from "lodash";
import { atom, selector, selectorFamily } from "recoil";
import { getInterventionSummary } from "../../shared/services/interventionSummary";
import { EngineState } from "./dataEngine";

export const InterventionSummary = atom({
  key: "intervention-summary-state",
  default: selector({
    key: "intervention-summary-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      return await getInterventionSummary(engine);
    },
  }),
});

export const CurrentInterventionSummary = selectorFamily({
  key: "current-intervention-summary-state",
  get:
    (interventionId: string) =>
    ({ get }) => {
      const interventionSummary = get(InterventionSummary);
      return find(interventionSummary, ["id", interventionId]);
    },
});
