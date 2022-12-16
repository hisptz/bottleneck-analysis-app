import { useDataQuery } from "@dhis2/app-runtime";
import { DataTableCell, DataTableRow } from "@dhis2/ui";
import { capitalize } from "lodash";
import React, { useEffect } from "react";
import Error from "../Error";
import Loader from "../Loader";

const query = {
  dataElementInIndicator: {
    resource: "dataElements",
    id: ({ id }: any) => id,
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

function OtherRowFields({ data }: { data: any }) {
  return (
    <>
      <DataTableCell bordered>{typeof data !== "undefined" ? data.valueType : "some value"}</DataTableCell>
      <DataTableCell bordered>{typeof data !== "undefined" ? capitalize(`${data.zeroIsSignificant}`) : null}</DataTableCell>
      <DataTableCell bordered>
        <ol>
          {typeof data !== "undefined"
            ? data?.categoryCombo?.categories?.map((cat: any) => {
                return <li key={cat.id}>{capitalize(cat.displayName)}</li>;
              })
            : null}
        </ol>
      </DataTableCell>
      <DataTableCell bordered>
        <ol>
          {typeof data !== "undefined"
            ? data?.dataSetElements?.map((dataSet: any) => {
                return <li key={dataSet.dataSet.id}>{dataSet.dataSet.displayName}</li>;
              })
            : null}
        </ol>
      </DataTableCell>
      <DataTableCell bordered>
        <ol>
          {typeof data !== "undefined"
            ? data.dataElementGroups?.map((group: any) => {
                return <li key={group.id}>{group.displayName}</li>;
              })
            : null}
        </ol>
      </DataTableCell>
    </>
  );
}

export default function Row({ dataElement }: { dataElement: any }) {
  const { loading, error, data, refetch } = useDataQuery(query, { variables: { id: "" }, lazy: true });

  function isPureDataElement(str: string) {
    return str?.indexOf(".") == -1;
  }

  function getData(id: string) {
    refetch({ id });
  }

  useEffect(() => {
    if (isPureDataElement(dataElement.id)) {
      getData(dataElement.id);
    } else {
      const arr = dataElement.id.split(".");
      getData(arr[0]);
    }
  }, [dataElement]);

  return (
    <DataTableRow>
      <DataTableCell bordered>{dataElement.val}</DataTableCell>
      <DataTableCell bordered>{capitalize(dataElement.location)}</DataTableCell>
      {loading && <Loader />}
      {error && <Error error={error} />}
      {data && <OtherRowFields data={data.dataElementInIndicator} />}
    </DataTableRow>
  );
}
