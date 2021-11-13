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
        ? rows.map(({ id: groupId, name: groupName, children }) =>
            children?.map(({ id: indicatorId, name: indicatorName, legend }, index) => (
              <DataTableRow key={`${groupId}-${indicatorId}-row`}>
                {index === 0 ? (
                  <DataTableCell fixed left={"0"} rowSpan={`${children?.length}`} className={classes["table-name-cell"]}>
                    {groupName}
                  </DataTableCell>
                ) : null}
                <DataTableCell fixed left={"200px"} className={classes["table-name-cell"]}>
                  {indicatorName}
                </DataTableCell>
                {columns?.map(({ id: orgUnitId }) => (
                  <TableCell key={`${indicatorId}-${orgUnitId}-cell`} id={indicatorId} colId={orgUnitId} data={data} legends={legend ?? []} />
                ))}
              </DataTableRow>
            ))
          )
        : rows.map(({ name, id }) => (
            <DataTableRow key={`${id}-row`}>
              <DataTableCell fixed left={"0"} className={classes["table-name-cell"]}>
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
