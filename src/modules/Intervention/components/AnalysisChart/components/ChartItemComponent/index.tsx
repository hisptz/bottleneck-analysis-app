import HighCharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import HighChartsExport from "highcharts/modules/exporting";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { getChartConfiguration } from "../../helper/get-chart-configuration.helper";
import { getCharObject } from "../../helper/get-chart-object.helper";
import { ChartConfigState } from "../../state/config";
import { ChartData } from "../../state/data";

export default function ChartItemComponent({ chartRef }: { chartRef: any }) {
  const { id } = useParams<{ id: string }>();
  const data = useRecoilValue(ChartData(id));
  const [chartConfigDefinitions, setChartConfigDefinitions] = useRecoilState(ChartConfigState(id));
  HighChartsExport(HighCharts);
  const chartConfiguration = {
    layout: {
      column: "ou",
      row: ["dx"],
      filter: ["pe"],
    },
    currentChartType: "column",
  };

  const analysisData = {
    _data: {
      ...data,
      metaData: {
        names: { ...restructureMetaData(data.metaData) },
        ...data.metaData.dimensions,
      },
    },
  };
  const [chartOptions, setChartOptions] = useState();

  function restructureMetaData(metaData: any): any {
    const restructure: { [key: string]: any } = {};
    Object.keys(metaData).forEach((key) => {
      if (key === "items") {
        Object.keys(metaData[key]).forEach((itemKey) => {
          restructure[itemKey] = metaData[key][itemKey]["name"];
        });
      } else {
      }
    });
    return restructure;
  }

  useEffect(() => {
    drawChart(analysisData["_data"], chartConfigurationSelector(chartConfiguration.layout, "column"));
  }, [data]);

  function drawChart(analyticsObject: any, drawChartConfiguration: any) {
    if (drawChartConfiguration && analyticsObject) {
      const chartObject = getCharObject(analyticsObject, drawChartConfiguration, chartConfigDefinitions);
      if (chartObject) {
        setChartOptions(chartObject);
      }
      setChartConfigDefinitions({ pointWidth: chartObject["plotOptions"]["series"]["pointWidth"] });
    }
  }

  function chartConfigurationSelector(layout: any, currentChartType: any) {
    return getChartConfiguration({}, id, layout, "Data", currentChartType, []);
  }

  return (
    <div
      className="chart-block"
      style={{
        height: "calc(" + 1000 + "px-20px",
        minWidth: "1196px",
        width: "auto",
      }}
    >
      <HighChartsReact ref={chartRef} highcharts={HighCharts} options={{ ...(chartOptions ?? {}), navigation: { buttonOptions: false } }} />
    </div>
  );
}
