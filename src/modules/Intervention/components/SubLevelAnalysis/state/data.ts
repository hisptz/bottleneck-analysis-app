import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { getSubLevelAnalytics } from "../../../../../shared/services/analytics";
import { DataItems, OrgUnit, Period } from "./dimensions";

export const SubLevelAnalyticsData = selectorFamily({
  key: "analytics-data",
  get:
    (id: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      const dataItems = get(DataItems(id));
      const period = get(Period(id));
      const orgUnit = get(OrgUnit(id));
      return await getSubLevelAnalytics({ dx: dataItems, ou: orgUnit, pe: period }, engine);
    },
});
