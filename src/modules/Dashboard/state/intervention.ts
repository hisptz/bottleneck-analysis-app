import { atom, selector } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import getInterventions from "../../../shared/services/getInterventions";
import { InterventionConfig } from "../../../shared/types/interventionConfig";

export const InterventionState = atom<Array<InterventionConfig> | undefined | any>({
  key: "dashboard-intervention-state",
  default: selector<Array<InterventionConfig> | undefined | Promise<any>>({
    key: "dashboard-intervention-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      if (engine) {
        return await getInterventions(engine);
      }
      return [];
    },
  }),
});
