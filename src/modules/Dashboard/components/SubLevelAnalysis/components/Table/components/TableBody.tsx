import { DataTableBody, DataTableCell, DataTableRow } from "@dhis2/ui";
import React from "react";
import classes from "../Table.module.css";

const rows = [
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
  [70, 57, 56, 59, 47, 70, 57, 56, 59, 47],
];

export default function TableBody() {
  return (
    <DataTableBody>
      {rows?.map((row) => (
        <DataTableRow className={classes["table-row"]} key={row[0]}>
          <DataTableCell left={"0"} width={"120px"} className={classes["table-cell"]} fixed>
            Commodities
          </DataTableCell>
          <DataTableCell left={"120px"} width={"300px"} className={classes["table-cell"]} fixed>
            Availability of Tetanus Toxoid
          </DataTableCell>
          {row.map((value) => (
            <td style={{ background: "#147e14" }} width={"200px"} className={classes["table-cell"]} align="center" key={value}>
              {value}
            </td>
          ))}
        </DataTableRow>
      ))}
    </DataTableBody>
  );
}
