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

  return (
    <DataTableHead>
      <DataTableRow>
        <DataTableColumnHeader colSpan={"100"} fixed top={"2px"} className={classes["table-header-cell"]}>
          {head(filter)?.name ?? ""}
        </DataTableColumnHeader>
      </DataTableRow>
      <DataTableRow className={classes["header-row"]}>
        {layout.columns.includes("ou") ? (
          <>
            <DataTableColumnHeader fixed left={"0"} top={"40px"} className={classes["table-header-cell"]}>
              {i18n.t("Determinant")}
            </DataTableColumnHeader>
            <DataTableColumnHeader fixed left={"200px"} className={classes["table-header-cell"]}>
              {i18n.t("Indicator")}
            </DataTableColumnHeader>
          </>
        ) : (
          <DataTableColumnHeader rowSpan={"2"} fixed top={"40px"} left={"0"} className={classes["table-header-cell"]}>
            {i18n.t("Organisation Units")}
          </DataTableColumnHeader>
        )}
        {columns?.map(({ name, id, children }) => (
          <DataTableColumnHeader
            width={"200px"}
            colSpan={`${children?.length}`}
            align={"center"}
            key={`${id}-col-header`}
            fixed
            top={"40px"}
            className={classes["table-data-header-cell"]}>
            {name}
          </DataTableColumnHeader>
        ))}
      </DataTableRow>
      <DataTableRow>
        {columns.map(({ children }) =>
          children?.map(({ name, id }) => (
            <DataTableColumnHeader width={"200px"} align={"center"} key={`${id}-col-header`} fixed top={"90px"} className={classes["table-data-header-cell"]}>
              {name}
            </DataTableColumnHeader>
          ))
        )}
      </DataTableRow>
    </DataTableHead>
  );
}
