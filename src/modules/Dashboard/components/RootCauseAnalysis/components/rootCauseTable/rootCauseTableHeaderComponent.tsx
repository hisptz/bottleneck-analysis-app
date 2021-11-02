import i18n from "@dhis2/d2-i18n";
import { TableHead, DataTableRow, DataTableColumnHeader } from "@dhis2/ui";
import React from "react";
import "./rootCauseTable.css";

export default function RootCauseTableHeaderComponent() {
  return (
    <TableHead>
      <DataTableRow>
        <DataTableColumnHeader>SN.</DataTableColumnHeader>
        <DataTableColumnHeader>OrgUnit</DataTableColumnHeader>
        <DataTableColumnHeader>Period</DataTableColumnHeader>
        <DataTableColumnHeader>Intervention</DataTableColumnHeader>
        <DataTableColumnHeader>Bottleneck</DataTableColumnHeader>
        <DataTableColumnHeader>Indicator</DataTableColumnHeader>
        <DataTableColumnHeader>Possible root cause</DataTableColumnHeader>
        <DataTableColumnHeader>Possible solution</DataTableColumnHeader>
        <DataTableColumnHeader>Action</DataTableColumnHeader>
      </DataTableRow>
    </TableHead>
  );
}
