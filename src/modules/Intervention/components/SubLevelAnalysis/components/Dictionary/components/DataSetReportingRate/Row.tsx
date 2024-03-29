import { useDataQuery } from "@dhis2/app-runtime";
import { DataTableCell, DataTableRow } from "@dhis2/ui";
import React from "react";
import classes from "../calculationDetails/Components/Row/Components/DataSourceCellStyle.module.css";

const query = {
  dataSets: {
    resource: "dataSets",
    id: ({ id }: any) => id,
    params: {
      fields: [
        "id",
        "displayName",
        "displayDescription",
        "timelyDays",
        "expiryDays",
        "periodType",
        "organisationUnits[id,displayName]",
        "dataSetElements[dataElement[id,displayName]]",
        "legendSets[id,displayName]",
      ],
    },
  },
};

export default function Row({ dataSet }: { dataSet: any }): React.ReactElement {
  const id = dataSet.id;

  const { loading, error, data } = useDataQuery(query, { variables: { id } });

  function OtherCells(dataSet: any) {
    return (
      <>
        <DataTableCell bordered>{dataSet?.timelyDays}</DataTableCell>
        <DataTableCell bordered>{dataSet?.expiryDays}</DataTableCell>
        <DataTableCell bordered>{dataSet?.periodType}</DataTableCell>
        <DataTableCell bordered>
          <div className={classes.sources}>
            <ol>
              {dataSet?.organisationUnits.map((org) => {
                return <li key={org?.id}>{org?.displayName}</li>;
              })}
            </ol>
          </div>
        </DataTableCell>
        <DataTableCell bordered>
          <div className={classes.sources}>
            <ol>
              {dataSet?.dataSetElements.map((dt) => {
                return <li key={dt?.dataElement?.id}>{dt?.dataElement?.displayName}</li>;
              })}
            </ol>
          </div>
        </DataTableCell>
        <DataTableCell bordered>
          <div className={classes.sources}>
            <ol>
              {dataSet?.legendSets.map((leg: any) => {
                return <li key={leg.id}>{leg.displayName}</li>;
              })}
            </ol>
          </div>
        </DataTableCell>
      </>
    );
  }

  return (
    <>
      <DataTableRow>
        <DataTableCell bordered>{dataSet?.val}</DataTableCell>
        <DataTableCell bordered>{dataSet?.location}</DataTableCell>
        {OtherCells(data?.dataSets)}
      </DataTableRow>
    </>
  );
}
