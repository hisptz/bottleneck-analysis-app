import { TableLayout } from "../../../../../shared/interfaces/layout";

export const normalTableLayout: TableLayout = {
  columns: ["ou"],
  rows: ["dx"],
  filter: ["pe"],
};

export const switchedTableLayout: TableLayout = {
  columns: ["dx"],
  rows: ["ou"],
  filter: ["pe"],
};
