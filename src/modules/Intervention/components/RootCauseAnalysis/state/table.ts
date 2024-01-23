import { RefObject } from "react";
import { atomFamily } from "recoil";

export const RootCauseTableRef = atomFamily<any | null, string>({
  key: "root-cause-table-ref",
  default: null,
});
