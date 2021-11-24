import { compact, find, flattenDeep } from "lodash";
import { selector, selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { ROOT_CAUSE_TABLE_COLUMNS } from "../constants/table";
import { getRootCauseConfig } from "../services/data";
import { RootCauseData } from "./data";

export const RootCauseConfig = selector({
  key: "root-cause-config",
  get: async ({ get }) => {
    const engine = get(EngineState);
    return await getRootCauseConfig(engine);
  },
});

export const RootCauseTableConfig = selectorFamily({
  key: "root-cause-table-config",
  get:
    (id: string) =>
    ({ get }) => {
      const config = get(RootCauseConfig);
      const data = get(RootCauseData(id));
      const rows = flattenDeep(data).map(({ dataValues }: any) => {
        return compact(
          ROOT_CAUSE_TABLE_COLUMNS.map(({ key }) => {
            const id = find(config.dataElements, ["name", key])?.id;
            return {
              key,
              value: dataValues ? dataValues[id] : "",
            };
          })
        );
      });

      return {
        columns: ROOT_CAUSE_TABLE_COLUMNS,
        rows,
      };
    },
});
