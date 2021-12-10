import { get as _get } from "lodash";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import { InterventionTemplateConfig } from "../../../shared/interfaces/interventionTemplateConfig";
import { getIntervention } from "../../../shared/services/getInterventions";
import getInterventionTemplates from "../../../shared/services/getInterventionTemplates";
import { isArchiveId } from "../../../shared/utils/archives";
import { Archive } from "../../Archives/state/data";

export const InterventionTemplateState = atom<Array<InterventionTemplateConfig> | undefined | any>({
  key: "intervention-intervention-state",
  default: selector<Array<InterventionTemplateConfig> | undefined | Promise<any>>({
    key: "intervention-intervention-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      if (engine) {
        return await getInterventionTemplates(engine);
      }
      return [];
    },
  }),
});

export const InterventionState = selectorFamily({
  key: "intervention-state",
  get:
    (id: string) =>
    async ({ get }) => {
      if (isArchiveId(id)) {
        const { config } = get(Archive(id)) ?? {};
        return config;
      }
      const engine = get(EngineState);
      return await getIntervention(engine, id);
    },
});

export const InterventionStateSelector = selectorFamily<any, { id: string; path: Array<string> }>({
  key: "intervention-config-selector",
  get:
    ({ id, path }: { id: string; path: Array<string> }) =>
    ({ get }) => {
      const config = get(InterventionState(id));
      return _get(config, path);
    },
});

export const InterventionDetailsState = atomFamily<boolean, string>({
  key: "intervention-details-state",
  default: false,
});

/**
 * TODO:
 * CHANGE THIS STATE INTO FAMILY
 * TO RECEIVE GROUP ID(INTERVENTION OPTIONAL), then a particular item clicked and change it state
 */
export const InterventionConfiguationDeterminant = atom<boolean>({
  key: "determinantConfiguration",
  default: false,
});
