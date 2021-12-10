import i18n from "@dhis2/d2-i18n";
import { DataTableColumnHeader, DataTableRow, TableHead } from "@dhis2/ui";
import React from "react";

export default function ArchiveListHeaderComponent(): React.ReactElement {
  return (
    <TableHead>
      <DataTableRow>
        <DataTableColumnHeader>{i18n.t("Intervention")}</DataTableColumnHeader>
        <DataTableColumnHeader>{i18n.t("Organisation Unit")}</DataTableColumnHeader>
        <DataTableColumnHeader>{i18n.t("Period")}</DataTableColumnHeader>
        <DataTableColumnHeader>{i18n.t("Date Archived")}</DataTableColumnHeader>
        <DataTableColumnHeader>{i18n.t("Action")}</DataTableColumnHeader>
      </DataTableRow>
    </TableHead>
  );
}
