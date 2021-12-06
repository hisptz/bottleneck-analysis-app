import i18n from "@dhis2/d2-i18n";
import { DataTableColumnHeader, DataTableHead, DataTableRow } from "@dhis2/ui";
import { head } from "lodash";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { TableConfig, TableLayout } from "../../../state/layout";
import classes from "../Table.module.css";

export default function TableHeader(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const tableConfig = useRecoilValue(TableConfig(id));
  const layout = useRecoilValue(TableLayout(id));
  const { columns } = tableConfig ?? {};
  const topRowHeight = "0";

  return (
    <DataTableHead>
      <DataTableRow className={classes["header-row"]}>
        {layout.columns.includes("ou") ? (
          <>
            <DataTableColumnHeader left={"0"} top={topRowHeight} fixed className={classes["table-header-cell"]}>
              {i18n.t("Determinant")}
            </DataTableColumnHeader>
            <DataTableColumnHeader left={"200px"} top={topRowHeight} fixed className={classes["table-header-cell"]}>
              {i18n.t("Indicator")}
            </DataTableColumnHeader>
          </>
        ) : (
          <DataTableColumnHeader fixed left={"0"} top={topRowHeight} rowSpan={"2"} className={classes["table-header-cell"]}>
            {i18n.t("Organisation Units")}
          </DataTableColumnHeader>
        )}
        {columns?.map(({ name, id, children }) => (
          <DataTableColumnHeader
            top={topRowHeight}
            fixed
            width={"100px"}
            colSpan={`${children?.length}`}
            align={"center"}
            key={`${id}-col-header`}
            className={classes["table-data-header-cell"]}>
            {name}
          </DataTableColumnHeader>
        ))}
      </DataTableRow>
      <DataTableRow>
        {columns.map(({ children }) =>
          children?.map(({ name, id }) => (
            <DataTableColumnHeader fixed top={"40px"} width={"100px"} align={"center"} key={`${id}-col-header`} className={classes["table-data-header-cell"]}>
              {name}
            </DataTableColumnHeader>
          ))
        )}
      </DataTableRow>
    </DataTableHead>
  );
}
