import { atomFamily } from "recoil";

export const SubLevelTableRef = atomFamily<any | null, string>({
  key: "sub-level-table-ref",
  default: null,
});
