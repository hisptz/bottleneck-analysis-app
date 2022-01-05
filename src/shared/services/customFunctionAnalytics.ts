import { map } from "async";
import { compact, find, findIndex, flatten, isEmpty } from "lodash";
import { CustomFunction as CustomFunctionInterface, FunctionRule } from "../interfaces/customFunctions";

const customFunctionQuery = {
  function: {
    resource: "dataStore/functions",
    id: ({ id }: any) => id,
  },
};

export async function getCustomFunction(engine: any, id: string): Promise<CustomFunctionInterface> {
  return (await engine.query(customFunctionQuery, { variables: { id } }))?.function as CustomFunctionInterface;
}

export async function runCustomFunction({
  orgUnits,
  periods,
  rule,
  code,
  progress,
}: {
  orgUnits: Array<string>;
  periods: Array<string>;
  rule: FunctionRule;
  code: string;
  progress: (progress: number) => void;
}) {
  const parameters = {
    ou: orgUnits.join(";"),
    pe: periods.join(";"),
    rule,
    layout: {
      rows: ["dx"],
      column: ["ou"],
      filter: ["pe"],
    },
    progress,
  };

  return await new Promise((resolve, reject) => {
    try {
      const customFunction = Function("parameters", `${code}`);
      customFunction({
        ...parameters,
        success: resolve,
        error: (error: any) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
    setTimeout(() => {
      reject("Function timed out");
    }, 20000);
  });
}

export async function evaluateCustomFunction({
  customFunction,
  ruleId,
  orgUnits,
  periods,
}: {
  customFunction?: CustomFunctionInterface;
  orgUnits: Array<string>;
  periods: Array<string>;
  ruleId: string;
}): Promise<Array<Array<string>> | null> {
  try {
    if (customFunction) {
      const rule: FunctionRule | string | undefined = find(customFunction?.rules, { id: ruleId });
      if (rule) {
        const data: any = await runCustomFunction({
          orgUnits,
          periods,
          rule: { ...rule, json: typeof rule.json === "string" ? JSON.parse(rule.json) : rule.json },
          code: customFunction?.function ?? "",
          progress: (progress) => console.log(progress),
        });

        //This is under the assumption a custom function returns analytics object with only one dx value
        if (data) {
          const rows = data?.rows;
          return rows?.map((row: Array<string>) => {
            //Replace the dx with the function.rule id
            const dxIndex = findIndex(data?.headers, { name: "dx" });
            if (dxIndex >= 0) {
              const updatedRow = [...row];
              updatedRow[dxIndex] = `${customFunction.id}.${ruleId}`;
              return updatedRow;
            }
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
}

export async function getCustomFunctionAnalytics({
  functions,
  periods,
  orgUnits,
  getCustomFunction,
}: {
  functions: Array<string>;
  periods: Array<string>;
  orgUnits: Array<string>;
  getCustomFunction: (functionId: string) => Promise<CustomFunctionInterface | undefined>;
}) {
  try {
    if (functions && !isEmpty(functions)) {
      return compact(
        flatten(
          await map(functions, async (id: string) => {
            try {
              const [functionId, ruleId] = id.split(".") ?? [];
              if (functionId) {
                const customFunction = await getCustomFunction(functionId);
                console.log(customFunction);
                return await evaluateCustomFunction({ customFunction, ruleId, periods, orgUnits });
              }
            } catch (e) {
              console.log(e);
              return;
            }
          })
        )
      );
    }
  } catch (e) {
    console.log(e);
  }
}
