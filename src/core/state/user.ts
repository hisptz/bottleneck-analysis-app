import i18n from "@dhis2/d2-i18n";
import { find, head } from "lodash";
import { atom, selector, selectorFamily } from "recoil";
import { OrgUnit } from "../../shared/interfaces/orgUnit";
import { User } from "../../shared/interfaces/user";
import { getUser, getUserAuthority } from "../services/user";
import { EngineState } from "./dataEngine";
import { InterventionSummary } from "./intervention";

export const UserState = atom<User>({
  key: "user-state",
  default: selector({
    key: "user-state-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      return await getUser(engine);
    },
  }),
});

export const UserOrganisationUnit = selector<OrgUnit | undefined>({
  key: "user-organisation-units-getter",
  get: ({ get }) => {
    const user = get(UserState);
    const organisationUnits = user?.organisationUnits ?? [];
    if (organisationUnits.length > 0) {
      return head(organisationUnits);
    } else {
      throw Error(i18n.t("Error fetching user details"));
    }
  },
});

export const UserAuthorityOnIntervention = selectorFamily({
  key: "user-scorecard-authority",
  get:
    (scorecardId) =>
    ({ get }) => {
      const interventionSummary = find(get(InterventionSummary), ["id", scorecardId]);
      const user = get(UserState);
      return getUserAuthority(user, interventionSummary);
    },
});
