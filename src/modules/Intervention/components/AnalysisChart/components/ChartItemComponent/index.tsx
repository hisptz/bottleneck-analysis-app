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
      column: ["dx"],
      row: ["pe"],
      filter: ["ou"],
    },
    currentChartType: "column",
  };
  const analysisData = {
    _data: {
      headers: [
        {
          name: "dx",
          column: "Data",
          valueType: "TEXT",
          type: "java.lang.String",
          hidden: false,
          meta: true,
        },
        {
          name: "ou",
          column: "Organisation unit",
          valueType: "TEXT",
          type: "java.lang.String",
          hidden: false,
          meta: true,
        },
        {
          name: "pe",
          column: "Period",
          valueType: "TEXT",
          type: "java.lang.String",
          hidden: false,
          meta: true,
        },
        {
          name: "value",
          column: "Value",
          valueType: "NUMBER",
          type: "java.lang.Double",
          hidden: false,
          meta: false,
        },
      ],
      metaData: {
        names: {
          "202107": "July 2021",
          "202108": "August 2021",
          "202109": "September 2021",
          "2021Q2": "Apr to Jun 2021",
          ImspTQPwCqd: "Sierra Leone",
          dx: "Data",
          pe: "Period",
          ou: "Organisation unit",
          ReUHfIn0pTQ: "ANC 1-3 Dropout Rate",
        },
        dx: ["ReUHfIn0pTQ"],
        pe: ["2021Q2", "202107", "202108", "202109"],
        ou: ["ImspTQPwCqd"],
        co: [],
      },
      rows: [
        ["ReUHfIn0pTQ", "ImspTQPwCqd", "2021Q2", "39.7"],
        ["ReUHfIn0pTQ", "ImspTQPwCqd", "202107", "33.4"],
        ["ReUHfIn0pTQ", "ImspTQPwCqd", "202108", "33.2"],
        ["ReUHfIn0pTQ", "ImspTQPwCqd", "202109", "31.3"],
      ],
      height: 4,
      width: 4,
    },
  };
  //   const [currentChartType, setCurrentChartType] = useState(chartConfiguration.currentChartType);
  const [chartOptions, setChartOptions] = useState();
  //   const [drawChartConfiguration, setDrawChartConfiguration] = useState(chartConfigurationSelector(chartConfiguration.layout, currentChartType));

  useEffect(() => {
    drawChart(analysisData["_data"], chartConfigurationSelector(chartConfiguration.layout, "column"));
  }, []);

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
    <div className="chart-item-container" style={{ width: "100%" }}>
      <div
        className="chart-block"
        style={{
          height: "calc(" + 1000 + "px-20px",
          width: "100%",
        }}>
        <HightChartsReact highcharts={HighCharts} options={chartOptions} />
      </div>
    </div>
  );
}
