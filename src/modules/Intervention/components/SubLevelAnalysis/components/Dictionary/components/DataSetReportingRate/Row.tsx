import { useDataQuery } from "@dhis2/app-runtime";
import { DataTableRow, DataTableCell, CircularLoader } from "@dhis2/ui";
import classes from "../calculationDetails/Components/Row/Components/DataSourceCellStyle.module.css";

const query = {
  dataSets: {
    resource: "dataSets",
    id: ({ id }) => id,
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

export default function Row(props) {
  const dataSet = props.dataSet;

  const id = dataSet.id;

  const { loading, error, data } = useDataQuery(query, { variables: { id } });
  // if(loading){
  //     return <CircularLoader />
  // }
  // if(error){
  //     return <i>Something went wrong</i>
  // }

  function OtherCells(dataSet) {
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
              {dataSet?.legendSets.map((leg) => {
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
