import { DataTableBody, DataTableCell, DataTableRow } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { TableConfig, TableLayout } from "../../../state/layout";
import classes from "../Table.module.css";
import TableCell from "./TableCell";

export default function TableBody() {
  const { id } = useParams<{ id: string }>();
  const { rows, columns, data } = useRecoilValue(TableConfig(id)) ?? {};
  const layout = useRecoilValue(TableLayout(id));
  return (
    <DataTableBody>
      {layout.rows.includes("dx")
        ? rows.map(({ id, name, children }) => (
            <DataTableRow key={`${id}-row`}>
              <DataTableCell colSpan={"1"} fixed left={"0"} rowSpan={`${children?.length}`} className={classes["table-name-cell"]}>
                {name}
              </DataTableCell>
              <td className={classes["nesting-cell"]} colSpan={100}>
                <table className={classes["nested-table"]}>
                  {children?.map(({ id: rowId, name, legend }) => (
                    <tr className="h-100" key={`${rowId}-data`}>
                      <DataTableCell fixed left={"200px"} className={classes["table-cell"]}>
                        {name}
                      </DataTableCell>
                      {columns?.map(({ id: colId }) => (
                        <TableCell key={`${rowId}-${colId}-cell`} id={rowId} colId={colId} data={data} legends={legend ?? []} />
                      ))}
                    </tr>
                  ))}
                </table>
              </td>
            </DataTableRow>
          ))
        : rows.map(({ name, id }) => (
            <DataTableRow key={`${id}-row`}>
              <DataTableCell fixed left={"0"} className={classes["table-cell"]}>
                {name}
              </DataTableCell>
              {columns?.map(({ children }) =>
                children?.map(({ id: colId, legend }) => <TableCell key={`${id}-${colId}-cell`} id={id} colId={colId} data={data} legends={legend ?? []} />)
              )}
            </DataTableRow>
          ))}
    </DataTableBody>
  );
}
