import { DataTable, DataTableHead, DataTableBody, DataTableRow, DataTableCell, DataTableColumnHeader, IconDimensionOrgUnit16 } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DataItem, Group } from "../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../state/intervention";
import { ChartConfigState } from "../../state/config";
import { ChartOrgUnits } from "../../state/data";
import classes from "./ChartLabelComponent.module.css";

export default function ChartLabelComponent() {
  const { id: interventionId } = useParams<{ id: string }>();

  const chartLabelDefinition = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["dataSelection", "groups"],
    })
  );
  //InterventionStateSelector
  const chartConfigurationDefinition = useRecoilValue(ChartConfigState(interventionId));
  // const orgUnitDefinition = useRecoilValue(
  //   InterventionStateSelector({      <HightChartsReact highcharts={HighCharts} options={chartOptions} />

  //     id: interventionId,
  //     path: ["orgUnitSelection", "orgUnit"],
  //   })
  // );
  const orgData = useRecoilValue(ChartOrgUnits(interventionId));
  return (
    <div className={classes["tableContainer"]}>
      <DataTable className={classes["tableHeader-h"]}>
        <DataTableHead>
          <DataTableRow>
            {chartLabelDefinition?.map((group: Group) => {
              return group.items?.map((dataItem: DataItem) => {
                return (
                  <DataTableColumnHeader width={chartConfigurationDefinition + "px"} className={classes["tableHeader"]} key={dataItem.id} fixed>
                    {dataItem.name}
                  </DataTableColumnHeader>
                );
              });
            })}
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          <DataTableRow>
            {chartLabelDefinition?.map((group: Group) => {
              return (
                <DataTableCell key={group.id} align={"center"} bordered colSpan={group.items.length}>
                  {group.name}
                </DataTableCell>
              );
            })}
          </DataTableRow>
        </DataTableBody>
      </DataTable>
      <div className={classes["analytic-orgUnit"]}>
        <div className={classes["analytic-orgUnit-icon"]}>
          <IconDimensionOrgUnit16 size={"20"} />
        </div>
        {orgData.join("    ,     ")}
      </div>
    </div>
  );
}
