import i18n from "@dhis2/d2-i18n";
import { DataTableColumnHeader, DataTableHead, DataTableRow, TableCellHead, TableHead, TableRowHead } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import classes from "../../../../../../../styles/Table.module.css";
import { TableConfig, TableLayout } from "../../../state/layout";
import { useTable } from "react-table";

export default function TableHeader(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const tableConfig = useRecoilValue(TableConfig(id));
  const { headerGroups } = useTable<Record<string, any>>({
    columns: tableConfig?.columns ?? [],
    data: tableConfig?.data ?? [],
  });

  console.log(tableConfig);

  return (
    <DataTableHead>
      {headerGroups.map((headerGroup) => (
        <DataTableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <DataTableColumnHeader {...column.getHeaderProps()} colSpan={`${(column.getHeaderProps() as any).colSpan}`}>
              {column.render("Header")}
            </DataTableColumnHeader>
          ))}
        </DataTableRow>
      ))}
    </DataTableHead>
  );
}
