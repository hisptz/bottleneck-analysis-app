import { useDataQuery } from "@dhis2/app-runtime";
import {
  DataTable,
  DataTableToolbar,
  DataTableHead,
  TableHead,
  DataTableBody,
  TableBody,
  DataTableFoot,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
  CircularLoader,
} from "@dhis2/ui";
import PropTypes from "prop-types";
import CalculationDetailRow from "../calculationDetails/Components/Row";

const query = {
  dataElementInIndicator: {
    resource: "dataElements",
    id: ({ id }) => id,
    params: {
      fields: [
        "id",
        "aggregationType",
        "valueType",
        "zeroIsSignificant",
        "dataSetElements[dataSet[id,displayName]]",
        "dataElementGroups[id,displayName]",
        "categoryCombo[categories[id,displayName]]",
      ],
    },
  },
};

export default function Row(props) {
  const datElement = props.datEl;

  function isPureDataElement(str) {
    if (str?.indexOf(".") == -1) {
      //didnt find
      return true;
    } else {
      return false;
    }
  }

  function getData(id) {
    const { loading, error, data } = useDataQuery(query, { variables: { id } });
    if (loading) {
      return <CircularLoader />;
    }

    if (error) {
      return <p> {error} </p>;
    }
    return data;
  }

  function theRow(datEle) {
    let data;
    if (isPureDataElement(datEle.id)) {
      data = getData(datEle.id).dataElementInIndicator;
    } else {
      const arr = datEle.id.split(".");
      data = getData(arr[0]).dataElementInIndicator;
    }
    // console.log(data)
    return (
      <>
        <DataTableCell bordered>
          {typeof data !== "undefined" ? data.valueType : "some value"}
        </DataTableCell>

        <DataTableCell bordered>
          {typeof data !== "undefined"
            ? JSON.stringify(data.zeroIsSignificant)
            : null}
        </DataTableCell>
        <DataTableCell bordered>
          <ol>
            {typeof data !== "undefined"
              ? data.categoryCombo.categories.map((cat) => {
                  return <li key={cat.id}>{cat.displayName}</li>;
                })
              : null}
          </ol>
        </DataTableCell>
        <DataTableCell bordered>
          <ol>
            {typeof data !== "undefined"
              ? data.dataSetElements.map((dataSet) => {
                  return (
                    <li key={dataSet.dataSet.id}>
                      {dataSet.dataSet.displayName}
                    </li>
                  );
                })
              : null}
          </ol>
        </DataTableCell>
        <DataTableCell bordered>
          <ol>
            {typeof data !== "undefined"
              ? data.dataElementGroups.map((group) => {
                  return <li key={group.id}>{group.displayName}</li>;
                })
              : null}
          </ol>
        </DataTableCell>
      </>
    );
  }

  return (
    <DataTableRow>
      <DataTableCell bordered>{datElement.val}</DataTableCell>
      <DataTableCell bordered>{datElement.location}</DataTableCell>
      {theRow(datElement)}
    </DataTableRow>
  );
}

// RowAggregate.prototype={
//     datEl:PropTypes.
//
// }
