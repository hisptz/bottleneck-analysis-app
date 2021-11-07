import { DataTableBody, DataTableCell, DataTableRow } from "@dhis2/ui";
import { find, last } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { TableConfig } from "../../../state/layout";
import classes from "../Table.module.css";

export default function TableBody() {
  const { id } = useParams<{ id: string }>();
  const { rows, columns, data } = useRecoilValue(TableConfig(id)) ?? {};
  return (
    <DataTableBody>
      {rows.map(({ id, name, children }) => (
        <DataTableRow key={`${id}-row`}>
          <DataTableCell fixed left={"0"} rowSpan={children?.length} width={"200px"} className={classes["table-cell"]}>
            {name}
          </DataTableCell>
          <td className={classes["nesting-cell"]} colSpan={10000}>
            <table className={classes["nested-table"]}>
              {children?.map(({ id: rowId, name, legend }) => (
                <tr className="h-100" key={`${rowId}-data`}>
                  <DataTableCell fixed left={"120px"} width={"200px"} className={classes["table-cell"]}>
                    {name}
                  </DataTableCell>
                  {columns?.map(({ id: colId }) => (
                    <DataTableCell className={classes["table-cell"]} align="center" width={"120px"} key={`${colId}-cell`}>
                      {last(find(data, (value) => value.includes(rowId) && value.includes(colId)))}
                    </DataTableCell>
                  ))}
                </tr>
              ))}
            </table>
          </td>
        </DataTableRow>
      ))}
    </DataTableBody>
  );
}
