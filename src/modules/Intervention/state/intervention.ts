import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import { InterventionTemplateConfig } from "../../../shared/interfaces/interventionTemplateConfig";
import { getIntervention } from "../../../shared/services/getInterventions";
import getInterventionTemplates from "../../../shared/services/getInterventionTemplates";

export const InterventionTemplateState = atom<Array<InterventionTemplateConfig> | undefined | any>({
  key: "dashboard-intervention-state",
  default: selector<Array<InterventionTemplateConfig> | undefined | Promise<any>>({
    key: "dashboard-intervention-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      if (engine) {
        return await getInterventionTemplates(engine);
      }
      return [];
    },
  }),
});

export const InterventionState = atomFamily({
  key: "intervention-state",
  default: selectorFamily({
    key: "intervention-state-setter",
    get:
      (id: string) =>
      async ({ get }) => {
        const engine = get(EngineState);
        return await getIntervention(engine, id);
      },
  }),
});
