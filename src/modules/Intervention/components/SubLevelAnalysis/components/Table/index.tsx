import { DataTable, DataTableColumnHeader, DataTableRow, SegmentedControl } from "@dhis2/ui";
import { head } from "lodash";
import React, { Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import CardLoader from "../../../../../../shared/components/loaders/CardLoader";
import classes from "../../../../../../styles/Table.module.css";
import { FullPageState } from "../../../../state/config";
import { normalTableLayout, switchedTableLayout } from "../../constants/tableLayouts";
import { TableConfig, TableLayout } from "../../state/layout";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";

export default function Table({ tableRef }: { tableRef: any }): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const switchLayout = useSetRecoilState(TableLayout(id));
  const { filter } = useRecoilValue(TableConfig(id)) ?? {};
  const isFullPage = useRecoilValue(FullPageState("subLevelAnalysis"));
  const [segmentedState, setSegmentedState] = useState<string>("org_unit_rows");

  const onLayoutChange = () => {
    setSegmentedState(segmentedState === "determinant_rows" ? "org_unit_rows" : "determinant_rows");
    switchLayout((prevLayout) => {
      if (prevLayout.columns.includes("dx")) {
        return switchedTableLayout;
      } else {
        return normalTableLayout;
      }
    });
  };

  return (
    <Suspense fallback={<CardLoader />}>
      <div className="column sub-level-analysis-table">
        <div className="row end p-8">
          <SegmentedControl
            className={"sub-level-analysis-table-switch"}
            onChange={onLayoutChange}
            options={[
              {
                label: "Determinant rows",
                value: "determinant_rows",
              },
              {
                label: "Org unit rows",
                value: "org_unit_rows",
              },
            ]}
            selected={segmentedState}
          />
        </div>
        <DataTable className={classes["header-table"]}>
          <DataTableRow>
            <DataTableColumnHeader fixed top={"0px"} align="center" className={classes["period-header-cell"]}>
              {head(filter)?.name ?? ""}
            </DataTableColumnHeader>
          </DataTableRow>
        </DataTable>
        <DataTable scrollHeight={isFullPage ? "calc(100vh - 200px)" : "500px"} ref={tableRef} fixed className={classes["table"]} bordered>
          <TableHeader />
          <TableBody />
        </DataTable>
      </div>
    </Suspense>
  );
}
