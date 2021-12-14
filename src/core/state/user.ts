import i18n from "@dhis2/d2-i18n";
import { head } from "lodash";
import { atom, selector } from "recoil";
import { OrgUnit } from "../../shared/interfaces/orgUnit";
import { User } from "../../shared/interfaces/user";
import { getUser } from "../services/user";
import { EngineState } from "./dataEngine";

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
