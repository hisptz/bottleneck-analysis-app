import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../core/state/dataEngine";
import { SubLevelOrgUnit } from "../../../state/dimensions";
import { getBoundaryData } from "../services/data";

export const BoundaryData = selectorFamily<any, string | undefined>({
  key: "boundary-data",
  get:
    (id?: string) =>
    async ({ get }) => {
      if (!id) return null;
      const orgUnit = get(SubLevelOrgUnit(id));
      const engine = get(EngineState);
      if (!orgUnit) return null;
      return await getBoundaryData(engine, orgUnit);
    },
});
