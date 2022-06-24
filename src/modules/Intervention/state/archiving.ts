import { selectorFamily } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import { getInterventionArchives } from "../../../shared/services/archives";

export const InterventionArchiveIds = selectorFamily({
  key: "intervention-archiving-id",
  get:
    (id: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      return await getInterventionArchives(engine, id);
    },
});
