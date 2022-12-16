/* eslint-disable no-console */
import { assign } from "lodash";

// import { ChartConfiguration } from "../interfaces/props";

export function getChartXAxisOptions(xAxisCategories: any[], chartConfiguration: any) {
  let xAxisOptions = {};
  const showBna = true;

  switch (chartConfiguration.type) {
    case "radar":
      xAxisOptions = assign(
        {},
        {
          categories: xAxisCategories,
          tickmarkPlacement: "on",
          lineWidth: 0,
        }
      );
      break;
    default:
      xAxisOptions = assign(
        {},
        {
          categories: showBna ? [...xAxisCategories?.map(() => "")] : [...xAxisCategories?.map((xAxisCategory) => xAxisCategory.name)],
          labels: {
            rotation: 0,
            useHTML: true,
            allowOverlap: true,
            style: {
              color: "#000000",
              fontWeight: "normal",
              fontSize: "12px",
              wordBreak: "break-all",
              textOverflow: "allow",
            },
            groupedOptions: [
              {
                style: {
                  color: "red", // set red font for labels in 1st-Level
                  fontWeight: "bold",
                  borderLeft: "5px solid red",
                  marginTop: "10px",
                },
                text: "<div style='padding-bottom:50px; float: left'>__________________________</div><br/><div style='padding-top:50px;'>${series.name}</div>",
                useHTML: true,
              },
            ],
          },
        }
      );
      break;
  }
  return xAxisOptions;
}
