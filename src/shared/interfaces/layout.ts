export type Dimension = "dx" | "ou" | "pe";

export type TableLayout = {
  columns: Array<Dimension>;
  rows: Array<Dimension>;
  filter: Array<Dimension>;
};
