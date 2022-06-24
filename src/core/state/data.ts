import { selectorFamily } from "recoil";
import { getIndicator } from "../services/data";
import { EngineState } from "./dataEngine";

export const IndicatorState = selectorFamily({
  key: "indicator-state",
  get:
    (id?: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      if (id) {
        return await getIndicator(id, engine);
      }
    },
});
