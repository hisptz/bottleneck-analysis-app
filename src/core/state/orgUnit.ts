import { atom, selector } from "recoil";
import { getOrgUnitLevels } from "../services/orgUnits";
import { EngineState } from "./dataEngine";

export const OrgUnitLevels = atom<Array<{ id: string; level: number; displayName: string }>>({
  key: "orgUnitLevels",
  default: selector({
    key: "orgUnitLevelsSelector",
    get: async ({ get }) => {
      const engine = get(EngineState);
      return await getOrgUnitLevels(engine);
    },
  }),
});
