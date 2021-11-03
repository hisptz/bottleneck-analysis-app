import { DataTableColumnHeader, DataTableHead, DataTableRow } from "@dhis2/ui";
import React from "react";
import classes from "../Table.module.css";

const columns = [
  "Bird District",
  "Cat District",
  "Dog District",
  "Fish District",
  "Game District",
  "Bird District",
  "Cat District",
  "Dog District",
  "Fish District",
  "Game District",
];

export default function TableHeader() {
  // const { id } = useParams<{ id: string }>();
  // const tableConfig = useRecoilValue(TableConfig(id));
  //
  // const { columns, filter, rowNames } = tableConfig ?? {};

  return (
    <DataTableHead>
      <DataTableRow>
        <DataTableColumnHeader left={"0"} fixed top={"0"} className={classes["table-header-cell"]} colSpan={"100000000"}>
          2019
        </DataTableColumnHeader>
      </DataTableRow>
      <DataTableRow>
        <DataTableColumnHeader fixed left={"0"} top={"38px"} width={"120px"} className={classes["table-header-cell"]}>
          Determinant
        </DataTableColumnHeader>
        <DataTableColumnHeader fixed left={"120px"} top={"38px"} width={"200px"} className={classes["table-header-cell"]}>
          Indicator
        </DataTableColumnHeader>
        {columns?.map((dimension) => (
          <DataTableColumnHeader fixed top={"37px"} className={classes["table-header-cell"]} align="center" key={dimension}>
            {dimension}
          </DataTableColumnHeader>
        ))}
      </DataTableRow>
    </DataTableHead>
  );
}
