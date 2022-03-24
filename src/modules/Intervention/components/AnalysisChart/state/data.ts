import * as _ from "lodash";
import { compact, get as _get } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../state/selections";
import { DataItems } from "../../SubLevelAnalysis/state/dimensions";
import { getData } from "../services/getChartAnalytics";
import { CustomFunction } from "../../../../../shared/state/customFunctions";
import { CustomFunction as CustomFunctionInterface } from "../../../../../shared/interfaces/customFunctions";

export const ChartData = selectorFamily({
  key: "chart-data",
  get:
    (id: string) =>
    async ({ get }) => {
      if (isArchiveId(id)) {
        const { chartData } = get(Archive(id)) ?? {};
        return chartData;
      }
      const engine = get(EngineState);
      const period = get(InterventionPeriodState(id))?.id;
      const orgUnit = get(InterventionOrgUnitState(id))?.id;
      const { dataItems, functions: functionIds } = get(DataItems(id));

      const functions: Array<{ id: string; function: CustomFunctionInterface }> = compact(
        functionIds?.map((id) => {
          const [functionId] = id.split(".") ?? [];
          if (functionId) {
            const customFunction = get(CustomFunction(functionId));
            if (customFunction) {
              return { id, function: customFunction };
            }
          }
          return;
        }) ?? []
      );

      return await getData({
        dataItems,
        engine,
        functions,
        period,
        orgUnit,
      });
    },
});

export const ChartDataOrgUnit = selectorFamily({
  key: "chart-data-org-unit",
  get:
    (id: string) =>
    ({ get }) => {
      const data = get(ChartData(id));
      return _get(data, "metaData.ou.items", []);
    },
});

export const ChartOrgUnits = selectorFamily({
  key: "chart-org-units",
  get:
    (id: string) =>
    async ({ get }) => {
      const chartData = get(ChartData(id));

      return chartData?.metaData?.dimensions?.ou?.map((ouId: string) => {
        return _.get(chartData.metaData, "items." + ouId + ".name", []);
      });
    },
});
