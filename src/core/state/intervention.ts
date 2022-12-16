import { filter, find } from "lodash";
import { atom, selector, selectorFamily } from "recoil";
import { InterventionSummary as InterventionSummaryType } from "../../shared/interfaces/interventionConfig";
import { getInterventionSummary } from "../../shared/services/interventionSummary";
import { getUserAuthority } from "../services/user";
import { EngineState } from "./dataEngine";
import { UserState } from "./user";

export const InterventionSummaryRequestId = atom({
  key: "request-id",
  default: 0,
});

export const AllInterventionSummary = selector({
  key: "all-intervention-summary",
  get: async ({ get }) => {
    const engine = get(EngineState);
    return await getInterventionSummary(engine);
  },
});

export const AuthorizedInterventionSummary = atom<Array<InterventionSummaryType>>({
  key: "intervention-summary-state",
  // @ts-ignore
  default: selector({
    key: "intervention-summary-getter",
    get: async ({ get }) => {
      const interventionSummaries = get(AllInterventionSummary);
      const user = get(UserState);
      return filter(interventionSummaries, (summary) => {
        const { read } = getUserAuthority(user, summary);
        return read;
      });
    },
  }),
});

export const CurrentInterventionSummary = selectorFamily({
  key: "current-intervention-summary-state",
  get:
    (interventionId: string) =>
    ({ get }) => {
      const interventionSummary = get(AuthorizedInterventionSummary);
      return find(interventionSummary, ["id", interventionId]);
    },
});

export const InterventionDoesNotExist = selectorFamily<boolean, string>({
  key: "intervention-does-not-exist-state",
  get:
    (interventionId: string) =>
    ({ get }) => {
      const interventionSummary = get(AllInterventionSummary);
      return !find(interventionSummary ?? [], ["id", interventionId]);
    },
});
