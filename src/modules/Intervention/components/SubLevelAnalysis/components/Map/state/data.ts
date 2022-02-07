import { find, findIndex, groupBy } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../core/state/dataEngine";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../../state/selections";
import { SubLevelOrgUnit } from "../../../state/dimensions";
import { BoundaryData } from "../components/BoundaryLayer/state/data";
import { getAnalyticsData } from "../services/data";
import { MapIndicatorState } from "./config";

export const MapIndicatorData = selectorFamily<any, string | undefined>({
  key: "map-indicator-data",
  get:
    (id?: string) =>
    async ({ get }) => {
      if (!id) return null;
      try {
        const subLevelOrgUnit = get(SubLevelOrgUnit(id));
        const selectedOrgUnit = get(InterventionOrgUnitState(id));
        const engine = get(EngineState);
        const indicators = get(MapIndicatorState(id));
        const orgUnits = [...subLevelOrgUnit, selectedOrgUnit.id];
        const orgUnitBoundaryData = get(BoundaryData(id));
        const period = get(InterventionPeriodState(id));
        const data = await getAnalyticsData({ dx: indicators?.map((indicator) => indicator.id) ?? [], pe: period.id, ou: orgUnits }, engine);
        const ouIndex = findIndex(data.headers, (header: any) => header.name === "ou");
        const dxIndex = findIndex(data.headers, (header: any) => header.name === "dx");
        const valueIndex = findIndex(data.headers, (header: any) => header.name === "value");
        const allData = data.rows.map((row: Array<string>) => {
          return {
            orgUnit: find(orgUnitBoundaryData, (boundary: any) => boundary.id === row[ouIndex]),
            indicator: find(indicators, (indicator: any) => indicator.id === row[dxIndex]),
            data: parseFloat(row[valueIndex]),
          };
        });
        return groupBy(allData, (data: any) => data.indicator.id);
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
});
