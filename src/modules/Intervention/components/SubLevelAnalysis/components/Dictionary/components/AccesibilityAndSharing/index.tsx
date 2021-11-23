import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { DataTable, DataTableCell, DataTableColumnHeader, DataTableRow, TableBody, TableHead } from "@dhis2/ui";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import Error from "../../../../../../../../shared/components/errors/CardError";
import Loader from "../../../../../../../../shared/components/loaders/FullPageLoader";
import { displayAccessPermission } from "../../utils/functions/dataElementDictionaryFunctions";
import { dateTimeDisplay } from "../../utils/functions/shared";

const query = {
  sources: {
    resource: "",
    id: ({ id }: any) => id,
    params: {
      fields: [
        "created",
        "user[displayName]",
        "lastUpdated",
        "lastUpdatedBy[displayName]",
        "userGroupAccesses[id,displayName,access]",
        "userAccesses[id,displayName,access]",
      ],
    },
  },
};

function displayDataType(resourceType: string) {
  if (resourceType === "dataElements") {
    return " Data Element ";
  } else {
    if (resourceType === "indicators") {
      return " Indicator ";
    }
    if (resourceType === "dataStore/functions") {
      return " Function ";
    }
  }
}

function accessAndSharingQuery(resourceType: string) {
  query.sources.resource = resourceType;
}

export default function AccessibilityAndSharing({ id, resourceType }: { resourceType: string; id: string }) {
  const { loading, error, data, refetch } = useDataQuery(query, {
    variables: { id },
  });

  useEffect(() => {
    accessAndSharingQuery(resourceType);
    refetch({ id });
  }, [id]);

  const result = data?.sources as unknown as {
    created: string;
    lastUpdated: string;
    user: { displayName: string };
    lastUpdatedBy: { displayName: string };
    userGroupAccesses: { id: string; displayName: string; access: string }[];
    userAccesses: { id: string; displayName: string; access: string }[];
  };

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <div>
      <h3>{i18n.t("Accessibility & Sharing Settings")} </h3>
      <p>
        {i18n.t("This")}
        {displayDataType(resourceType)} {i18n.t("was first created on")}
        <i> {dateTimeDisplay(result?.created)}</i> {i18n.t("by")}
        <b>{result?.user?.displayName} </b> {i18n.t("and last updated on")}
        <i>{dateTimeDisplay(result?.lastUpdated)}</i> {i18n.t("by")} <b>{result?.lastUpdatedBy?.displayName}</b> .
      </p>
      <p>
        {displayDataType(resourceType)} {i18n.t("will be visible for users with the following access:")}
      </p>
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader />
            <DataTableColumnHeader>{i18n.t("Details")}</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>
          <DataTableRow>
            <DataTableCell bordered tag="th">
              {i18n.t("User Access")}
            </DataTableCell>
            <DataTableCell bordered>
              {i18n.t(result?.userAccesses?.length === 0 ? "No access granted" : "")}
              <ul>
                {result?.userAccesses?.map((dt) => {
                  return (
                    <li key={dt.id}>
                      {dt?.displayName} {i18n.t("can")} <i>{displayAccessPermission(dt.access)} </i>
                    </li>
                  );
                })}
              </ul>
            </DataTableCell>
          </DataTableRow>
          <DataTableRow>
            <DataTableCell bordered tag="th">
              {i18n.t("User Group Access")}
            </DataTableCell>
            <DataTableCell bordered>
              {i18n.t(result?.userGroupAccesses?.length === 0 ? "No access granted" : "")}
              <ul>
                {result?.userGroupAccesses?.map((dt) => {
                  return (
                    <li key={dt.id}>
                      {dt?.displayName} {i18n.t("can")} <i>{displayAccessPermission(dt?.access)}</i>{" "}
                    </li>
                  );
                })}
              </ul>
            </DataTableCell>
          </DataTableRow>
        </TableBody>
      </DataTable>
    </div>
  );
}

AccessibilityAndSharing.propTypes = {
  id: PropTypes.string.isRequired,
  resourceType: PropTypes.string.isRequired,
};
