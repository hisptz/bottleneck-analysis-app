import React, { useEffect } from "react";
import { useRecoilCallback } from "recoil";
import { DataElementsStateDictionary, DataSetReportingRatesStateDictionary, ProgramIndicatorStateDictionary } from "../../state";
import AccessibilityAndSharing from "../AccesibilityAndSharing";
import CalculationDetails from "../calculationDetails/Index";
import DataElementsIndicator from "../dataElementsInIndicator/dataElementsIndicator";
import DatasetsReportingRates from "../DataSetReportingRate";
import DataSource from "../DataSource/dataSource";
import IndicatorFacts from "../indicatorFacts/indicatorFacts";
import Introduction from "../introduction/Introduction";
import LegendsAnalysis from "../legendsAnalysis/legendsAnalysis";
import ProgramIndicatorIndicator from "../ProgramIndicator";

export default function SingleDictionary({ id }: { id: string }) {
  const reset = useRecoilCallback(({ reset }) => () => {
    reset(DataElementsStateDictionary);
    reset(DataSetReportingRatesStateDictionary);
    reset(ProgramIndicatorStateDictionary);
  });
  useEffect(() => {
    return () => {
      reset();
    };
  }, [id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Introduction id={id} />
      <DataSource id={id} />
      <IndicatorFacts id={id} />
      <LegendsAnalysis id={id} />
      <CalculationDetails id={id} />
      <DataElementsIndicator id={id} />
      <ProgramIndicatorIndicator />
      <DatasetsReportingRates />
      <AccessibilityAndSharing id={id} resourceType={"indicators"} />
    </div>
  );
}
