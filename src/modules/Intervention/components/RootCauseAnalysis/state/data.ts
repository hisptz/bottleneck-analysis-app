import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { getRootCausesData } from "../services/data";

export const RootCauseData = selectorFamily({
  key: "root-cause-analysis-data",
  get:
    (id: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      return await getRootCausesData(engine, id);
    },
});
