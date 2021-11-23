import i18n from "@dhis2/d2-i18n";
import { DataTable, DataTableCell, DataTableColumnHeader, DataTableRow, TableBody, TableHead } from "@dhis2/ui";
import PropTypes from "prop-types";
import React from "react";
import { useRecoilValue } from "recoil";
import { DictionaryIndicatorSelector } from "../../state";
import CalculationDetailRow from "./Components/Row";

export default function CalculationDetails({ id }: { id: string }) {
  const numerator = useRecoilValue(DictionaryIndicatorSelector({ id, path: ["numerator"] }));
  const denominator = useRecoilValue(DictionaryIndicatorSelector({ id, path: ["denominator"] }));

  return (
    <div>
      <h3> {i18n.t("Calculation details")}</h3>
      <p> {i18n.t("Below are expression computing numerator and denominator, and related sources")} </p>

      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader bordered>{i18n.t("Expression")}</DataTableColumnHeader>
            <DataTableColumnHeader bordered>{i18n.t("Formula")}</DataTableColumnHeader>
            <DataTableColumnHeader bordered>{i18n.t("Sources")}</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>
          <DataTableRow>
            <DataTableCell bordered>{i18n.t("Numerator")}</DataTableCell>
            <CalculationDetailRow data-test={"test-numerator-metadata"} formula={numerator} location="numerator" />
          </DataTableRow>
          <DataTableRow>
            <DataTableCell bordered>{i18n.t("Denominator")}</DataTableCell>

            <CalculationDetailRow formula={denominator} location="denominator" />
          </DataTableRow>
        </TableBody>
      </DataTable>
    </div>
  );
}

CalculationDetails.propTypes = {
  id: PropTypes.string.isRequired,
};
