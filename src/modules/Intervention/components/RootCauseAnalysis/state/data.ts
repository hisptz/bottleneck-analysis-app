import { filter, flattenDeep } from "lodash";
import { atom, selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../state/selections";
import { getRootCausesData } from "../services/data";

export const RootCauseDataRequestId = atom({
  key: "root-cause-config-request-id",
  default: 0,
});

export const RootCauseData = selectorFamily({
  key: "root-cause-analysis-data",
  get:
    (id: string) =>
    async ({ get }) => {
      if (isArchiveId(id)) {
        const { rootCauseData } = get(Archive(id)) ?? {};
        return rootCauseData;
      }
      const engine = get(EngineState);
      const period = get(InterventionPeriodState(id));
      const orgUnit = get(InterventionOrgUnitState(id));

      const rootCauseData = await getRootCausesData(engine, id);
      return filter(flattenDeep(rootCauseData), (data: any) => {
        const { id: rootCauseId } = data;
        return rootCauseId.match(`${period.id}_${orgUnit.id}`);
      });
    },
});
