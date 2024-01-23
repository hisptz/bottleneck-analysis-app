import { TableLayout } from "../../../../../shared/interfaces/layout";

export const normalTableLayout: TableLayout = {
  columns: ["dx"],
  rows: ["ou"],
  filter: ["pe"],
};

export const switchedTableLayout: TableLayout = {
  columns: ["ou"],
  rows: ["dx"],
  filter: ["pe"],
};
