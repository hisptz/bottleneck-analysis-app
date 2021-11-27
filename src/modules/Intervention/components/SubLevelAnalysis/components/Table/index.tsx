import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, DataTable } from "@dhis2/ui";
import React, { Suspense, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useScreenDimension from "../../../../../../core/hooks/useScreenDimension";
import CardLoader from "../../../../../../shared/components/loaders/CardLoader";
import { getExcelFileFromAnalyticsData } from "../../../../../../shared/utils/download";
import { InterventionStateSelector } from "../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../state/selections";
import { normalTableLayout, switchedTableLayout } from "../../constants/tableLayouts";
import { TableConfig, TableLayout } from "../../state/layout";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import classes from "./Table.module.css";

export default function Table() {
  const { id } = useParams<{ id: string }>();
  const switchLayout = useSetRecoilState(TableLayout(id));
  const interventionName = useRecoilValue<string>(InterventionStateSelector({ id, path: ["name"] }));
  const { name: periodName } = useRecoilValue(InterventionPeriodState(id));
  const { displayName: orgUnitName } = useRecoilValue(InterventionOrgUnitState(id));
  const { width } = useRecoilValue(TableConfig(id));
  const { width: screenWidth } = useScreenDimension();

  const tableRef = useRef(null);
  const onLayoutChange = () => {
    switchLayout((prevLayout) => {
      if (prevLayout.columns.includes("dx")) {
        return normalTableLayout;
      } else {
        return switchedTableLayout;
      }
    });
  };

  const onDownloadExcel = () => {
    getExcelFileFromAnalyticsData(tableRef, `${interventionName}_${orgUnitName}_${periodName}`);
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
          <ButtonStrip>
            <Button onClick={onLayoutChange}>{i18n.t("Switch Layout")}</Button>
            <Button onClick={onDownloadExcel}>{i18n.t("Download Excel")}</Button>
          </ButtonStrip>
        </div>
        <DataTable ref={tableRef} fixed width={`${tableWidth}px`} scrollWidth={"5000px"} scrollHeight={"500px"} className={classes["table"]} bordered>
          <TableHeader />
          <TableBody />
        </DataTable>
      </div>
    </Suspense>
  );
}
