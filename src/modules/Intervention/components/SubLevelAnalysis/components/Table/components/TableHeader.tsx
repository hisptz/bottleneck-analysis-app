import i18n from "@dhis2/d2-i18n";
import { DataTableColumnHeader, DataTableHead, DataTableRow } from "@dhis2/ui";
import { head } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { TableConfig, TableLayout } from "../../../state/layout";
import classes from "../Table.module.css";

export default function TableHeader() {
  const { id } = useParams<{ id: string }>();
  const tableConfig = useRecoilValue(TableConfig(id));
  const layout = useRecoilValue(TableLayout(id));
  const { columns, filter } = tableConfig ?? {};

  console.log(columns);
  return (
    <DataTableHead>
      <DataTableRow>
        <DataTableColumnHeader colSpan={"100"} fixed className={classes["table-header-cell"]}>
          {head(filter)?.name ?? ""}
        </DataTableColumnHeader>
      </DataTableRow>
      <DataTableRow>
        {layout.columns.includes("ou") ? (
          <>
            <DataTableColumnHeader fixed left={"0"} width={"120px"} className={classes["table-header-cell"]}>
              {i18n.t("Determinant")}
            </DataTableColumnHeader>
            <DataTableColumnHeader fixed left={"120px"} width={"200px"} className={classes["table-header-cell"]}>
              {i18n.t("Indicator")}
            </DataTableColumnHeader>
          </>
        ) : (
          <DataTableColumnHeader rowSpan={2} fixed left={"0"} width={"200px"} className={classes["table-header-cell"]}>
            {i18n.t("Organisation Units")}
          </DataTableColumnHeader>
        )}
        {columns?.map(({ name, id, children }) => (
          <td className={classes["nesting-cell"]} key={`${id}-header-table`}>
            <table className={classes["nested-table"]}>
              <tr className={classes["nesting-row"]}>
                <DataTableColumnHeader
                  colSpan={children?.length}
                  align={"center"}
                  key={`${id}-col-header`}
                  fixed
                  width={"120px"}
                  className={classes["table-header-cell"]}>
                  {name}
                </DataTableColumnHeader>
              </tr>
              <tr className={classes["nesting-row"]}>
                {children?.map(({ name, id }) => (
                  <DataTableColumnHeader align={"center"} key={`${id}-col-header`} fixed width={"120px"} className={classes["table-header-children-cell"]}>
                    {name}
                  </DataTableColumnHeader>
                ))}
              </tr>
            </table>
          </td>
        ))}
      </DataTableRow>
    </DataTableHead>
  );
}
