import { DataTableCell } from "@dhis2/ui";
import PropTypes from "prop-types";
import React from "react";
import { getFinalWordFormula } from "../../../../utils/functions/formulaFunctions";
import { useGetFormulaDataDetailed } from "../../../../utils/hooks/Indicator";
import classes from "./Components/DataSourceCellStyle.module.css";
import DisplaySourceDataElement from "./Components/DisplaySourceDataElement";
import DisplaySourceDataSet from "./Components/DisplaySourceDataSet";
import DisplaySourceProgramDataElementOrAttribute from "./Components/DisplaySourceProgramDataElementOrAttribute";
import DisplaySourceProgramIndicator from "./Components/DisplaySourceProgramIndicator";

export default function CalculationDetailRow({ formula, location }: { formula: string; location: string }) {
  const data = useGetFormulaDataDetailed(formula, location);

  return (
    <>
      <DataTableCell bordered width={"50%"}>
        <code style={{ color: "#F26E96" }}>{getFinalWordFormula(formula, data)}</code>
      </DataTableCell>
      <DataTableCell bordered>
        <div className={classes.sources}>
          {data?.dataElements?.length > 0 ? <DisplaySourceDataElement title={"Data Elements"} data={data?.dataElements} /> : ""}
          {data?.dataSetReportingRates?.length > 0 ? <DisplaySourceDataSet title={"Data Sets"} data={data?.dataSetReportingRates} /> : ""}
          {data?.programIndicators?.length > 0 ? <DisplaySourceProgramIndicator title={"Program Indicators"} data={data?.programIndicators} /> : ""}
          {data?.programDataElements?.length > 0 ? (
            <DisplaySourceProgramDataElementOrAttribute title={"Tracker Data Element"} data={data?.programDataElements} />
          ) : (
            ""
          )}
          {data?.attributes?.length > 0 ? <DisplaySourceProgramDataElementOrAttribute title={"Tracker Data Element"} data={data?.attributes} /> : ""}
        </div>
      </DataTableCell>
    </>
  );
}

CalculationDetailRow.propTypes = {
  formula: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};
