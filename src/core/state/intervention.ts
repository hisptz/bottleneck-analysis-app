import { find } from "lodash";
import { atom, selector, selectorFamily } from "recoil";
import { InterventionSummary as InterventionSummaryType } from "../../shared/interfaces/interventionConfig";
import { getInterventionSummary } from "../../shared/services/interventionSummary";
import { EngineState } from "./dataEngine";

export const RequestId = atom({
  key: "request-id",
  default: 0,
});

export const InterventionSummary = atom<Array<InterventionSummaryType>>({
  key: "intervention-summary-state",
  default: selector({
    key: "intervention-summary-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      get(RequestId);
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
