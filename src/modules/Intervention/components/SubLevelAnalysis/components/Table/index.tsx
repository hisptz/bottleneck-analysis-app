import { Button, DataTable } from "@dhis2/ui";
import React, { Suspense, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useScreenDimension from "../../../../../../core/hooks/useScreenDimension";
import CardLoader from "../../../../../../shared/components/loaders/CardLoader";
import { normalTableLayout, switchedTableLayout } from "../../constants/tableLayouts";
import { TableConfig, TableLayout } from "../../state/layout";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import classes from "./Table.module.css";

export default function Table() {
  const { id } = useParams<{ id: string }>();
  const switchLayout = useSetRecoilState(TableLayout(id));
  const { width } = useRecoilValue(TableConfig(id));
  const { width: screenWidth } = useScreenDimension();
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
          <Button onClick={onLayoutChange}>Switch Layout</Button>
        </div>
        <DataTable width={`${tableWidth}px`} scrollWidth={"5000px"} scrollHeight={"500px"} className={classes["table"]} bordered>
          <TableHeader />
          <TableBody />
        </DataTable>
      </div>
    </Suspense>
  );
}
