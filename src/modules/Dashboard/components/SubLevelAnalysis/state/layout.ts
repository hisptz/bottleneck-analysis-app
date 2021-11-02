import { atom } from "recoil";
import { TableLayout as Layout } from "../../../../../shared/types/layout";

export const TableLayout = atom<Layout>({
  key: "sub-level-layout-state",
  default: {
    columns: ["ou"],
    rows: ["dx"],
    filter: ["pe"],
  },
});
