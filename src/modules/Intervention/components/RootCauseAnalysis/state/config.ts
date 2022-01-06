import { light } from "@material-ui/core/styles/createPalette";
import { compact, find, flattenDeep } from "lodash";
import { selector, selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { ROOT_CAUSE_TABLE_COLUMNS } from "../constants/table";
import { getRootCauseConfig } from "../services/data";
import { RootCauseDataSelector } from "./data";

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
      const rowIds: string[] = [];
      const isArchive = isArchiveId(id);
      const columns = isArchive ? ROOT_CAUSE_TABLE_COLUMNS.filter(({ key }) => key !== "Actions") : ROOT_CAUSE_TABLE_COLUMNS;
      const config = get(RootCauseConfig);
      const data = get(RootCauseDataSelector(id));
      const rows = flattenDeep(data)?.map(({ dataValues, id: rootCauseId }: any) => {
        rowIds?.push(rootCauseId);
        return compact(
          columns?.map(({ key }) => {
            const id = find(config.dataElements, ["name", key])?.id;
            return {
              key,
              value: dataValues ? dataValues[id] : "",
            };
          })
        );
      });

      return {
        columns,
        rowIds,
        rows,
      };
    },
});
