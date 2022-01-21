import { colors } from "@dhis2/ui";
import { find, last, flattenDeep } from "lodash";
import { DataItem, Group } from "../../../../../shared/interfaces/interventionConfig";

function getValue(data: Array<Array<string>>, id: string) {
  return parseInt(last(find(data, (datum: Array<string>) => datum.includes(id))) ?? "");
}

function getChartConfig(id: string) {
  return { renderTo: id, zoomType: "xy", type: "column", height: 500, title: { enabled: false } };
}

function getSeriesConfig(data: any, groups: Array<Group>) {
  const orgUnitId = data?.metaData?.dimensions?.ou?.[0];
  const orgUnitName = data?.metaData?.items?.[orgUnitId]?.name;

  const seriesData = flattenDeep(
    groups.map((group) => group.items.map((item) => ({ id: item.id, name: item.label ?? "", dataLabels: { enabled: true }, y: getValue(data.rows, item.id) })))
  );
  return [
    {
      id: orgUnitId,
      name: orgUnitName,
      index: 0,
      turboThreshold: 0,
      data: seriesData,
      type: "column",
      showInLegend: true,
      states: {
        select: {
          color: colors.red500,
          enabled: true,
        },
      },
      allowPointSelect: true,
    },
  ];
}

function getSubTitle(data: any) {
  const periodId = data?.metaData?.dimensions?.pe?.[0];
  const periodName = data?.metaData?.items?.[periodId]?.name;
  return { text: periodName, align: "left", style: { fontWeight: "600", fontSize: "13px" } };
}

function getColors(groups: Array<Group>) {
  return flattenDeep(groups.map((group) => group?.items?.map(() => group?.style?.color)));
}

function getXAxis(groups: Array<Group>) {
  const categories = groups.map(({ name, items }) => {
    return {
      name,
      categories: items.map(({ label, name }) => label ?? name ?? ""),
    };
  });
  return {
    categories,
  };
}

function getExporting(name: string) {
  return {
    scaling: 2,
    printMaxWidth: 1200,
    filename: `${name}`,
    sourceWidth: 1200,
  };
}

export default function getChartOptions({ id, data, groups, name }: { id: string; data: any; groups: Array<Group>; name: string }) {
  return {
    chart: getChartConfig(id),
    colors: getColors(groups),
    series: getSeriesConfig(data, groups),
    title: { text: "" },
    credits: { enabled: false },
    tooltip: {
      enabled: true,
      // padding: 2,
      style: {
        padding: "2px",
        paddingBottom: "0px",
      },
      formatter: function () {
        console.log("this ", this, "groups are ", groups);
        const tooltipFormat = groups.map((group: Group) => {
          return group.items.map((item: DataItem) => {
            if (item.name) {
              return item.name + `<br>` + '<span style="color:' + this.color + '"> ●</span>' + this.series.name + `:<b>` + this.y + `</b>`;
            } else {
              return item.shortName + `<br>` + '<span style="color:' + this.color + '"> ●</span>' + this.series.name + `:<b>` + this.y + `</b>`;
            }
          });
        });
        // console.log([...tooltipFormat[this.colorIndex]][this.colorIndex]);
        // console.log("fkjd ", tooltipFormat, this.colorIndex);
        return [...flattenDeep(tooltipFormat)][this.colorIndex];
      },
    },
    yAxis: [
      {
        max: 100,
        title: { text: "", style: { color: "#000000", fontWeight: "normal", fontSize: "14px" } },
        labels: { enable: false, style: { color: "#000000", fontWeight: "normal", fontSize: "14px" } },
        plotLines: [
          { color: "#000000", dashStyle: "Solid", width: 2, zIndex: 1000, label: { text: "" } },
          { color: "#bbbbbb", dashStyle: "Solid", zIndex: 1000, width: 2, label: { text: "" } },
        ],
      },
    ],
    xAxis: getXAxis(groups),
    plotOptions: {
      height: "100%",
      width: "100%",
      series: { cursor: "pointer" },
      column: { showInLegend: false, colorByPoint: true },
    },
    pane: {
      center: ["50%", "85%"],
      size: "140%",
      startAngle: -90,
      endAngle: 90,
      background: { backgroundColor: "#EEE", innerRadius: "60%", outerRadius: "100%", shape: "arc" },
    },
    exporting: getExporting(name),
    legend: { enabled: true },
  };
}
