import { map } from "async";
import { compact, flatten, isEmpty } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../core/state/dataEngine";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../modules/Intervention/state/selections";
import { CustomFunction as CustomFunctionInterface } from "../interfaces/customFunctions";
import { evaluateCustomFunction, getCustomFunction } from "../services/customFunctionAnalytics";

export const CustomFunction = selectorFamily<CustomFunctionInterface | undefined, string>({
  key: "customFunction",
  get:
    (id: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      if (id) {
        return await getCustomFunction(engine, id);
      }
    },
});

export const CustomFunctionsData = selectorFamily<Array<Array<string>> | undefined, { functions: Array<string>; interventionId: string }>({
  key: "customFunctionsData",
  get:
    ({ functions, interventionId }: { functions: Array<string>; interventionId: string }) =>
    async ({ get }) => {
      try {
        if (functions && !isEmpty(functions)) {
          return compact(
            flatten(
              await map(functions, async (id: string) => {
                const [functionId, ruleId] = id.split(".") ?? [];
                if (functionId) {
                  const customFunction = get(CustomFunction(functionId));
                  const orgUnit = get(InterventionOrgUnitState(interventionId));
                  const period = get(InterventionPeriodState(interventionId));
                  return await evaluateCustomFunction({ customFunction, ruleId, periods: [period.id], orgUnits: [orgUnit.id] });
                }
              })
            )
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
});
