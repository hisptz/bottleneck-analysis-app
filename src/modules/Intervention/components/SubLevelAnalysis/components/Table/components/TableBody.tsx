import { DataTableBody, DataTableCell, TableRow } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { TableConfig, TableLayout } from "../../../state/layout";
import { useRowState, useTable } from "react-table";
import TableCell from "./TableCell";

export default function TableBody(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { columns, data, rowState } = useRecoilValue(TableConfig(id)) ?? {};

  console.log(rowState);
  const { rows, prepareRow } = useTable<Record<string, any>>(
    {
      columns: columns ?? [],
      getRowId: (originalRow) => originalRow.id,
      data: data ?? [],
      initialState: {
        rowState: { ...rowState },
      } as any,
    },
    useRowState
  );

  console.log({ rows, data });

  return (
    <DataTableBody>
      {rows.map((row, i) => {
        prepareRow(row);
        return (
          <TableRow {...row.getRowProps()}>
            {row.cells.map((cell) => {
              console.log({
                cell,
              });
              if (!cell.value) {
                return null;
              }
              return (
                <TableCell
                  {...cell.getCellProps()}
                  rowSpan={cell.state.rowSpan}
                  colId={cell.column.id}
                  value={cell.value}
                  legends={row.state.legends ?? cell.state.legends}
                />
              );
            })}
          </TableRow>
        );
      })}
    </DataTableBody>
  );
}
