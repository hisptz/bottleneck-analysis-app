import HighCharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { InterventionStateSelector } from "../../../../state/intervention";
import useSelectedPoints from "../../hooks/use-selected-points";
import { ChartRef } from "../../state/chart";
import { ChartData } from "../../state/data";
import getChartOptions from "../../utils/getChartOptions";

export default function ChartItemComponent({
	height,
}: {
	height: string | number;
}): React.ReactElement {
	const { id } = useParams<{ id: string }>();
	const data = useRecoilValue(ChartData(id));
	const name = useRecoilValue(
		InterventionStateSelector({ id, path: ["name"] }),
	);
	const groups = useRecoilValue(
		InterventionStateSelector({ id, path: ["dataSelection", "groups"] }),
	);
	const allowOver100Values = useRecoilValue(
		InterventionStateSelector({
			id,
			path: ["dataSelection", "allowOver100Values"],
		}),
	);
	const chartRef = useSetRecoilState(ChartRef(id));
	const chartOptions = useMemo(
		() => getChartOptions({ id, data, groups, name, allowOver100Values }),
		[id, data, groups, name, allowOver100Values],
	);
	useSelectedPoints();

	return (
		<div
			style={{
				overflow: "hidden",
				width: "100%",
				height: "100%",
				minHeight: 500,
			}}
			className="chart-block"
		>
			<HighChartsReact
				containerProps={{ id: `${id}`, style: { height: "100%" } }}
				immutable
				ref={chartRef}
				highcharts={HighCharts}
				options={{
					...(chartOptions ?? {}),
					navigation: { buttonOptions: false },
					chart: { ...chartOptions.chart },
				}}
			/>
		</div>
	);
}
