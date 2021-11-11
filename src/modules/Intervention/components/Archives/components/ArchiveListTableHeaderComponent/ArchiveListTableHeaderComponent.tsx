import { TableHead, DataTableRow, DataTableColumnHeader } from "@dhis2/ui";
import React from "react";

export default function ArchiveListHeaderComponent() {
  return (
    <>
      <TableHead>
        <DataTableRow>
          <DataTableColumnHeader>Intervention</DataTableColumnHeader>
          <DataTableColumnHeader>Organisation unit</DataTableColumnHeader>
          <DataTableColumnHeader>Period</DataTableColumnHeader>
          <DataTableColumnHeader>Date archived</DataTableColumnHeader>
          <DataTableColumnHeader>Action</DataTableColumnHeader>
        </DataTableRow>
      </TableHead>
    </>
  );
}
