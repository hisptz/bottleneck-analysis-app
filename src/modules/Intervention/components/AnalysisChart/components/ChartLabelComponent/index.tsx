/* eslint-disable no-console */
import { DataTable, DataTableHead, DataTableBody, DataTableRow, DataTableCell, DataTableColumnHeader } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DataItem, Group } from "../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../state/intervention";

export default function ChartLabelComponent() {
  const { id: interventionId } = useParams<{ id: string }>();

  const chartLabelDefinition = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["dataSelection", "groups"],
    })
  );
  console.log("labels ", chartLabelDefinition);
  return (
    <div>
      <DataTable>
        <DataTableHead>
          <DataTableRow>
            {chartLabelDefinition?.map((group: Group) => {
              return group.items?.map((dataItem: DataItem) => {
                return <DataTableColumnHeader key={dataItem.id}>{dataItem.name}</DataTableColumnHeader>;
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
    </div>
  );
}
