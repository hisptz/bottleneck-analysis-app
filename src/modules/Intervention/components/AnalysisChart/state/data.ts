import { selectorFamily } from "recoil";
import { DataItems, OrgUnit, Period } from "../../SubLevelAnalysis/state/dimensions";

export const ChartData = selectorFamily({
  key: "chart-data",
  get:
    (id: string) =>
    async ({ get }) => {
      const period = get(Period(id));
      const orgUnits = get(OrgUnit(id));
      const data = get(DataItems(id));
      console.log({ data, period, orgUnits });
      return {};
    },
});
