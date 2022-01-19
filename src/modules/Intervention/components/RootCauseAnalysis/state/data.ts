import { filter, flatten, flattenDeep, uniqBy } from "lodash";
import { atom, atomFamily, selectorFamily } from "recoil";
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
        // @ts-ignore
        setSelf(async () => {
          if (isArchiveId(id)) {
            const { rootCauseData } = (await getPromise(Archive(id))) ?? {};
            return rootCauseData;
          }
          const engine = await getPromise(EngineState);
          return await getRootCausesData(engine, id);
        });
      }
    },
  ],
});

export const RootCauseDataIsEmpty = selectorFamily<boolean, string>({
  key: "root-cause-data-is-empty",
  get:
    (id: string) =>
    ({ get }) => {
      const data = get(RootCauseData(id));
      return flatten(data).length === 0;
    },
});

export const RootCauseDataSelector = selectorFamily<Array<RootCauseDataInterface>, string>({
  key: "root-cause-data-selector",
  get:
    (id: string) =>
      ({ get }) => {
        const rootCauseData = get(RootCauseData(id));
        const period = get(InterventionPeriodState(id));
        const orgUnit = get(InterventionOrgUnitState(id));
        return filter(flattenDeep(rootCauseData), (data: any) => {
          const { id: rootCauseId } = data;
          return rootCauseId.match(`${period?.id}_${orgUnit?.id}`);
        }) as Array<RootCauseDataInterface>;
      },
  set:
    (id: string) =>
      ({ set, get }, data) => {
        const period = get(InterventionPeriodState(id));
        const orgUnit = get(InterventionOrgUnitState(id));
        set(RootCauseData(id), (prevState) => {
          const otherRootCauses = filter(flattenDeep(prevState), (data: any) => {
            const { id: rootCauseId } = data;
            return !rootCauseId.match(`${period?.id}_${orgUnit?.id}`);
          }) as Array<RootCauseDataInterface>;
          return uniqBy(flattenDeep([...otherRootCauses, ...(data as Array<RootCauseDataInterface>)]), "id");
        });
      },
});
