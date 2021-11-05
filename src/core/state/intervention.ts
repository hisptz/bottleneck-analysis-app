import { atom, selector } from "recoil";
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
