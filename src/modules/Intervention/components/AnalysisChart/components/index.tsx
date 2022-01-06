import React from "react";
import ChartItemComponent from "./ChartItemComponent";

export default function AnalysisChart({ chartRef, height }: { chartRef: any; height: string | number }): React.ReactElement {
  return <ChartItemComponent height={height} chartRef={chartRef} />;
}
