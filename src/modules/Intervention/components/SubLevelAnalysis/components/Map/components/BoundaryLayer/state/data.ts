import { flatten } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../../../core/state/dataEngine";
import { InterventionOrgUnitState } from "../../../../../../../state/selections";
import { SubLevelOrgUnit } from "../../../../../state/dimensions";
import { getBoundaryData } from "../../../services/data";
import { convertCoordinates } from "../../../utils/map";
import { InterventionState } from "../../../../../../../state/intervention";
import { LastOrgUnitLevel } from "../../../../../../../../../core/state/orgUnit";

export const BoundaryData = selectorFamily<any, string | undefined>({
  key: "boundary-data",
  get:
    (id?: string) =>
    async ({ get }) => {
      if (!id) {
        return null;
      }
      const { map } = get(InterventionState(id)) ?? {};
      if (!map?.enabled) {
        return null;
      }
      const subLevelOrgUnit = get(SubLevelOrgUnit(id));
      const selectedOrgUnit = get(InterventionOrgUnitState(id));
      const engine = get(EngineState);
      const lastLevel = get(LastOrgUnitLevel);

      if (!subLevelOrgUnit) {
        return null;
      }

      const boundaryData = await getBoundaryData(engine, [
        selectedOrgUnit.id,
        ...(subLevelOrgUnit.includes(`LEVEL-${lastLevel?.level}`) ? [] : subLevelOrgUnit),
      ]);
      return flatten(
        boundaryData?.map((area: { co: string; id: string; na: string; le: number }) => {
          const coordinates = JSON.parse(area.co);

          return {
            id: area.id,
            name: area.na,
            level: area.le,
            co:
              typeof coordinates[0] === "number"
                ? convertCoordinates(coordinates)
                : flatten(coordinates)?.map((points: any) => {
                    if (!points) {
                      return [];
                    }
                    if (typeof points[0] === "number") {
                      return convertCoordinates(points);
                    }
                    return points?.map(convertCoordinates);
                  }),
          };
        })
      );
    },
});
