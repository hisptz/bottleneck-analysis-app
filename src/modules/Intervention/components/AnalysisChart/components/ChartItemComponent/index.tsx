import HighCharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionStateSelector } from "../../../../state/intervention";
import { ChartData } from "../../state/data";
import getChartOptions from "../../utils/getChartOptions";

export default function ChartItemComponent({ chartRef }: { chartRef: any }): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const data = useRecoilValue(ChartData(id));
  const name = useRecoilValue(InterventionStateSelector({ id, path: ["name"] }));
  const groups = useRecoilValue(InterventionStateSelector({ id, path: ["dataSelection", "groups"] }));

  const chartOptions = useMemo(() => getChartOptions({ id, data, groups, name }), [id, data, groups, name]);

  return (
    <div style={{ overflow: "auto", width: "100%", height: 500 }}>
      <HighChartsReact
        containerProps={{ id: `${id}` }}
        immutable
        ref={chartRef}
        highcharts={HighCharts}
        options={{ ...(chartOptions ?? {}), navigation: { buttonOptions: false } }}
      />
    </div>
  );
}
