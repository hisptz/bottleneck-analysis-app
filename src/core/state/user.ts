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
