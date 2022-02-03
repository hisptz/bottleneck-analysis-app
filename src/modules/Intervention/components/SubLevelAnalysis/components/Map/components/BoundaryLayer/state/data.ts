import { flatten } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../../../core/state/dataEngine";
import { InterventionOrgUnitState } from "../../../../../../../state/selections";
import { SubLevelOrgUnit } from "../../../../../state/dimensions";
import { getBoundaryData } from "../../../services/data";
import { convertCoordinates } from "../../../utils/map";

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
      const boundaryData = await getBoundaryData(engine, [selectedOrgUnit.id, ...subLevelOrgUnit]);
      return flatten(
        boundaryData?.map((area: { co: string; id: string; na: string; le: number }) => ({
          id: area.id,
          name: area.na,
          level: area.le,
          co: flatten(JSON.parse(area.co)).map((points: any) => {
            if (!points) return [];
            if (typeof points[0] === "number") {
              return convertCoordinates(points);
            }
            return points?.map(convertCoordinates);
          }),
        }))
      );
    },
});
