import { DataTableColumnHeader, DataTableHead, DataTableRow } from "@dhis2/ui";
import React from "react";
import "../rootCauseTable.css";
import classes from "../../../../../../../styles/Table.module.css";
import { TableColumn } from "../../../interfaces/table";

export default function RootCauseTableHeader({ columns }: { columns: Array<TableColumn> }): React.ReactElement {
  return (
    <DataTableHead>
      <DataTableRow className={classes["header-row"]}>
        {columns.map((column: TableColumn) => (
          <DataTableColumnHeader className={classes["table-header-cell"]} key={column.key}>
            {column.label}
          </DataTableColumnHeader>
        ))}
      </DataTableRow>
    </DataTableHead>
  );
}
