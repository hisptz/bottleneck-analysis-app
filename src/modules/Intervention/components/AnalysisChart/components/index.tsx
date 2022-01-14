import React from "react";
import ChartItemComponent from "./ChartItemComponent";

export default function AnalysisChart({ height }: { height: string | number }): React.ReactElement {
  return <ChartItemComponent height={height} />;
}
