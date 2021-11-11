import { atom } from "recoil";
import { tabs } from "../constants/tabs";

export const ActiveTab = atom<string>({
  key: "sub-analysis-active-tab",
  default: tabs[0]?.key,
});
