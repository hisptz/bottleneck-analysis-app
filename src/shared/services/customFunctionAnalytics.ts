import { find, findIndex, head } from "lodash";
import { CustomFunction, FunctionRule } from "../interfaces/customFunctions";

const customFunctionQuery = {
  function: {
    resource: "dataStore/functions",
    id: ({ id }: any) => id,
  },
};

export async function getCustomFunction(engine: any, id: string): Promise<CustomFunction> {
  return (await engine.query(customFunctionQuery, { variables: { id } }))?.function as CustomFunction;
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
    const customFunction = Function("parameters", `${code}`);
    customFunction({
      ...parameters,
      success: resolve,
      error: (error: any) => {
        reject(error);
      },
    });
    setTimeout(() => {
      reject("Request timed out");
    }, 20000);
  });
}

export async function evaluateCustomFunction({
  customFunction,
  ruleId,
  orgUnits,
  periods,
}: {
  customFunction?: CustomFunction;
  orgUnits: Array<string>;
  periods: Array<string>;
  ruleId: string;
}): Promise<Array<Array<string>> | null> {
  if (customFunction) {
    const rule: FunctionRule | string | undefined = find(customFunction?.rules, { id: ruleId });
    if (rule) {
      const data: any = await runCustomFunction({
        orgUnits,
        periods,
        rule: typeof rule === "string" ? JSON.parse(rule) : rule,
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

  return null;
}
