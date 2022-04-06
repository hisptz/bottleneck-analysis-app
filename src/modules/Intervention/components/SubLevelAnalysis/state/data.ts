import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { InterventionPeriodState } from "../../../state/selections";
import { DataItems, SubLevelOrgUnit } from "./dimensions";
import { getData } from "../../AnalysisChart/services/getChartAnalytics";
import { CustomFunction } from "../../../../../shared/state/customFunctions";
import { CustomFunction as CustomFunctionInterface } from "../../../../../shared/interfaces/customFunctions";
import { compact } from "lodash";

export const SubLevelAnalyticsData = selectorFamily({
  key: "analytics-data",
  get:
    (id: string) =>
    async ({ get }) => {
      if (isArchiveId(id)) {
        const { subLevelData } = get(Archive(id)) ?? {};
        return subLevelData;
      }
      const engine = get(EngineState);
      const { dataItems, functions: functionIds } = get(DataItems(id));
      const period = get(InterventionPeriodState(id))?.id;
      const orgUnits = get(SubLevelOrgUnit(id));

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
        functions,
        engine,
        period,
        orgUnits,
      });
    },
});
