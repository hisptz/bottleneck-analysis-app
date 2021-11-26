import { atom, selector } from "recoil";
import { getUser } from "../services/user";
import { EngineState } from "./dataEngine";

export const UserState = atom({
  key: "user-state",
  default: selector({
    key: "user-state-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      return await getUser(engine);
    },
  }),
});

export const UserOrganisationUnits = selector({
  key: "user-organisation-units-getter",
  get: ({ get }) => {
    const user = get(UserState);
    const organisationUnits = user?.organisationUnits || [];
    return organisationUnits.length > 1 ? organisationUnits : organisationUnits[0] || {};
  },
});
