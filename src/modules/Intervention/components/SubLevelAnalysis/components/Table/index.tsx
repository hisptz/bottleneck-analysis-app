import i18n from "@dhis2/d2-i18n";
import { Button, DataTable, DataTableColumnHeader, DataTableRow } from "@dhis2/ui";
import { head } from "lodash";
import React, { Suspense, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useScreenDimension from "../../../../../../core/hooks/useScreenDimension";
import CardLoader from "../../../../../../shared/components/loaders/CardLoader";
import { FullPageState } from "../../../../state/config";
import { normalTableLayout, switchedTableLayout } from "../../constants/tableLayouts";
import { TableConfig, TableLayout } from "../../state/layout";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import classes from "./Table.module.css";

export default function Table({ tableRef }: { tableRef: any }): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const switchLayout = useSetRecoilState(TableLayout(id));
  const { filter } = useRecoilValue(TableConfig(id));
  const { width } = useRecoilValue(TableConfig(id));
  const { width: screenWidth } = useScreenDimension();
  const isFullPage = useRecoilValue(FullPageState("subLevelAnalysis"));

  const onLayoutChange = () => {
    switchLayout((prevLayout) => {
      if (prevLayout.columns.includes("dx")) {
        return normalTableLayout;
      } else {
        return switchedTableLayout;
      }
    });
  };

  const tableWidth = useMemo(() => {
    if (width < screenWidth) {
      return screenWidth - 72;
    }
    return width;
  }, [width, screenWidth]);

  return (
    <Suspense fallback={<CardLoader />}>
      <div className="column">
        <div className="row end p-8">
          <Button onClick={onLayoutChange}>{i18n.t("Switch Layout")}</Button>
        </div>
        <DataTable className={classes["header-table"]}>
          <DataTableRow>
            <DataTableColumnHeader fixed top={"0px"} align="left" className={classes["period-header-cell"]}>
              {head(filter)?.name ?? ""}
            </DataTableColumnHeader>
          </DataTableRow>
        </DataTable>
        <DataTable
          ref={tableRef}
          fixed
          width={isFullPage ? "calc(100vw - 36px)" : `${tableWidth}px`}
          scrollWidth={"5000px"}
          scrollHeight={isFullPage ? "calc(100vh - 200px)" : "800px"}
          className={classes["table"]}
          bordered>
          <TableHeader />
          <TableBody />
        </DataTable>
      </div>
    </Suspense>
  );
}
