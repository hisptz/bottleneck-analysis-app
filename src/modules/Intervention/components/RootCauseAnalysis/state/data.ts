import { filter, flattenDeep } from "lodash";
import { atom, atomFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../state/selections";
import { RootCauseDataInterface } from "../interfaces/rootCauseData";
import { getRootCausesData } from "../services/data";

export const RootCauseDataRequestId = atom({
  key: "root-cause-config-request-id",
  default: 0,
});

export const RootCauseData = atomFamily<Array<RootCauseDataInterface>, string>({
  key: "root-cause-data",
  default: [],
  effects_UNSTABLE: (id: string) => [
    ({ getPromise, trigger, setSelf }) => {
      if (trigger === "get") {
        setSelf(async () => {
          if (isArchiveId(id)) {
            const { rootCauseData } = (await getPromise(Archive(id))) ?? {};
            return rootCauseData;
          }
          const engine = await getPromise(EngineState);
          const period = await getPromise(InterventionPeriodState(id));
          const orgUnit = await getPromise(InterventionOrgUnitState(id));

          const rootCauseData = await getRootCausesData(engine, id);
          return filter(flattenDeep(rootCauseData), (data: any) => {
            const { id: rootCauseId } = data;
            return rootCauseId.match(`${period.id}_${orgUnit.id}`);
          }) as Array<RootCauseDataInterface>;
        });
      }
    },
  ],
});
