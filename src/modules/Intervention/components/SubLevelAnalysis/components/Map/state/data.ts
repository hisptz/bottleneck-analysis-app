import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../core/state/dataEngine";
import { InterventionOrgUnitState } from "../../../../../state/selections";
import { SubLevelOrgUnit } from "../../../state/dimensions";
import { getBoundaryData } from "../services/data";

export const BoundaryData = selectorFamily<any, string | undefined>({
  key: "boundary-data",
  get:
    (id?: string) =>
    async ({ get }) => {
      if (!id) return null;
      const subLevelOrgUnit = get(SubLevelOrgUnit(id));
      const selectedOrgUnit = get(InterventionOrgUnitState(id));
      const engine = get(EngineState);
      if (!subLevelOrgUnit) return null;
      return await getBoundaryData(engine, [selectedOrgUnit.id, ...subLevelOrgUnit]);
    },
});
