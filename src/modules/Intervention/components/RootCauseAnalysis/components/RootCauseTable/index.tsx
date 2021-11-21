import i18n from "@dhis2/d2-i18n";
import { Button, DataTable, DataTableCell, DataTableRow, IconMore24, TableBody, TableFoot } from "@dhis2/ui";
import React, { useRef, useState } from "react";
import "./rootCauseTable.css";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { RootCauseTableConfig } from "../../state/config";
import RootCauseTableHeaderComponent from "./components/RootCauseTableHeaderComponent";
import classes from "./RootCauseTable.module.css";
import { find } from "lodash";

export default function RootCauseTable() {
  const { id } = useParams<{ id: string }>();
  const { columns, rows } = useRecoilValue(RootCauseTableConfig(id));
  const ref = useRef<HTMLDivElement | null>(null);
  const [stateRef, setstateRef] = useState<any>();

  return (
    <DataTable className={classes["table"]} bordered>
      <RootCauseTableHeaderComponent columns={columns} />
      <TableBody>
        {rows.map((row, index) => (
          <DataTableRow key={index}>
            {row.map(({ key, value }, index) => {
              if (key === "Actions") {
                return (
                  <DataTableCell className={classes["table-cell"]} key={index} align="center">
                    <Button
                      className={classes["button"]}
                      onClick={() => {
                        setstateRef(row);
                        ref.current?.scrollIntoView({ behavior: "smooth" });
                      }}>
                      <IconMore24 />
                    </Button>
                  </DataTableCell>
                );
              }
              const { disabled } = find(columns, ["key", key]) ?? {};
              return (
                <DataTableCell fixed={disabled ? disabled : undefined} align="center" className={classes["table-cell"]} key={index}>
                  {value}
                </DataTableCell>
              );
            })}
          </DataTableRow>
        ))}
      </TableBody>
      <TableFoot>
        <DataTableRow>
          <DataTableCell align={"right"} colSpan={`${columns.length}`}>
            <Button>{i18n.t("Add New")}</Button>
          </DataTableCell>
        </DataTableRow>
      </TableFoot>
    </DataTable>
  );
}
