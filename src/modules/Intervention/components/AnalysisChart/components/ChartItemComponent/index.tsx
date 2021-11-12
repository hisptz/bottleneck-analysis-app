/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
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
      row: ["ou"],
      filter: ["pe"],
    },
    currentChartType: "column",
  };
  const dydata = {
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
        name: "value",
        column: "Value",
        valueType: "NUMBER",
        type: "java.lang.Double",
        hidden: false,
        meta: false,
      },
    ],
    metaData: {
      items: {
        "2020": {
          name: "2020",
        },
        ImspTQPwCqd: {
          name: "Sierra Leone",
        },
        sB79w2hiLp8: {
          name: "ANC 3 Coverage",
        },
        c8fABiNpT0B: {
          name: "ANC IPT 2 Coverage",
        },
        dx: {
          name: "Data",
        },
        dy1a1mseGR7: {
          name: "ANC visits total",
        },
        iCBpPh3ehjg: {
          name: "BCG Coverage - Adjusted for reporting",
        },
        pe: {
          name: "Period",
        },
        ou: {
          name: "Organisation unit",
        },
        Uvn6LCg7dVU: {
          name: "ANC 1 Coverage",
        },
        OdiHJayrsKo: {
          name: "ANC 2 Coverage",
        },
      },
      dimensions: {
        dx: ["Uvn6LCg7dVU", "OdiHJayrsKo", "sB79w2hiLp8", "c8fABiNpT0B", "dy1a1mseGR7", "iCBpPh3ehjg"],
        pe: ["2020"],
        ou: ["ImspTQPwCqd"],
        co: [],
      },
    },
    rows: [
      ["Uvn6LCg7dVU", "ImspTQPwCqd", "103.5"],
      ["OdiHJayrsKo", "ImspTQPwCqd", "95.7"],
      ["sB79w2hiLp8", "ImspTQPwCqd", "67.0"],
      ["c8fABiNpT0B", "ImspTQPwCqd", "96.9"],
      ["dy1a1mseGR7", "ImspTQPwCqd", "651184.0"],
      ["iCBpPh3ehjg", "ImspTQPwCqd", "88.7"],
    ],
    height: 6,
    width: 3,
    headerWidth: 3,
  };
  const analysisData = {
    _data: {
      ...dydata,
      metaData:{
       names:{ ...restructureMetaData(dydata.metaData)      },
       ...dydata.metaData.dimensions
      
      }
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
