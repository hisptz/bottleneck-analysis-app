import { flatten } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../../../core/state/dataEngine";
import { LastOrgUnitLevel } from "../../../../../../../../../core/state/orgUnit";
import { InterventionOrgUnitState } from "../../../../../../../state/selections";
import { getBoundaryData } from "../../../services/data";
import { convertCoordinates } from "../../../utils/map";

export const FacilityMapData = selectorFamily({
  key: "facility-map-data",
  get:
    (id?: string) =>
    async ({ get }) => {
      if (id) {
        try {
          const lastLevel = get(LastOrgUnitLevel);
          const selectedOrgUnit = get(InterventionOrgUnitState(id));
          const engine = get(EngineState);
          const boundaryData = await getBoundaryData(engine, [selectedOrgUnit.id, `LEVEL-${lastLevel?.level}`]);
          return flatten(
            boundaryData?.map((area: { co: string; id: string; na: string; le: number }) => ({
              id: area.id,
              name: area.na,
              level: area.le,
              co: convertCoordinates(JSON.parse(area.co)),
            }))
          );
        } catch (e) {
          console.error(e);
          return [];
        }
      }
    },
});
