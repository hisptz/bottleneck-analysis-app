import { atom, selector } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import { InterventionTemplateConfig } from "../../../shared/interfaces/interventionTemplateConfig";
import getInterventions from "../../../shared/services/getInterventions";

export const InterventionState = atom<Array<InterventionTemplateConfig> | undefined | any>({
  key: "dashboard-intervention-state",
  default: selector<Array<InterventionTemplateConfig> | undefined | Promise<any>>({
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
