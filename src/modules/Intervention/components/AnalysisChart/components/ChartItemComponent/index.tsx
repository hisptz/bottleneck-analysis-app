/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import HighCharts from "highcharts";
import HightChartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getChartConfiguration } from "../../helper/get-chart-configuration.helper";
import { getCharObject } from "../../helper/get-chart-object.helper";
import { ChartData } from "../../state/data";

export default function ChartItemComponent() {
  const { id } = useParams<{ id: string }>();
  const data = useRecoilValue(ChartData(id));

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
  //   const [currentChartType, setCurrentChartType] = useState(chartConfiguration.currentChartType);
  const [chartOptions, setChartOptions] = useState();
  //   const [drawChartConfiguration, setDrawChartConfiguration] = useState(chartConfigurationSelector(chartConfiguration.layout, currentChartType));
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
      const chartObject = getCharObject(analyticsObject, drawChartConfiguration);
      if (chartObject) {
        setChartOptions(chartObject);
      }
    }
  }

  function chartConfigurationSelector(layout: any, currentChartType: any) {
    return getChartConfiguration({}, "", layout, "Data", currentChartType, []);
  }
  return (
    <div
      className="chart-block"
      style={{
        height: "calc(" + 1000 + "px-20px",
        width: "100%",
      }}>
      <HightChartsReact highcharts={HighCharts} options={chartOptions} />
    </div>
  );
}
