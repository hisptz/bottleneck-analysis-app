import { selector } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { getRootCauseConfig } from "./data";

export const RootCauseConfig = selector({
  key: "root-cause-config",
  get: async ({ get }) => {
    const engine = get(EngineState);
    return await getRootCauseConfig(engine);
  },
});
