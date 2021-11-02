import { atom } from "recoil";

export const EngineState = atom<any | undefined>({
  key: "engine-state",
  default: undefined,
});
