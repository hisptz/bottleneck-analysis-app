import React from "react";
import ChartItemComponent from "./ChartItemComponent";

export default function AnalysisChart({ chartRef }: { chartRef: any }): React.ReactElement {
  return <ChartItemComponent chartRef={chartRef} />;
}
