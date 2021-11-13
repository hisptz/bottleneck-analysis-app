import { DataTableColumnHeader, DataTableRow, DataTableHead } from "@dhis2/ui";
import React from "react";
import "../rootCauseTable.css";
import { TableColumn } from "../../../interfaces/table";
import classes from "../RootCauseTable.module.css";

export default function RootCauseTableHeaderComponent({ columns }: { columns: Array<TableColumn> }) {
  return (
    <DataTableHead>
      <DataTableRow className={classes["header-row"]}>
        {columns.map((column: TableColumn) => (
          <DataTableColumnHeader class={classes["table-header-cell"]} key={column.key}>
            {column.label}
          </DataTableColumnHeader>
        ))}
      </DataTableRow>
    </DataTableHead>
  );
}
