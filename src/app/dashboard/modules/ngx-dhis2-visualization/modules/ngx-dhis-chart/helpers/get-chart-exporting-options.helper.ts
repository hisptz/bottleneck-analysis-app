export function getChartExportingOptions(xAxisCategories): any {
  return {
    chartOptions: {
      title: {
        style: {
          fontSize: '10px'
        }
      },
      subtitle: {
        style: {
          fontSize: '10px'
        }
      },
      xAxis: [
        {
          categories: xAxisCategories,
          labels: {
            style: {
              fontSize: '6px'
            }
          },
          rotation: 0
        }
      ]
    },
    buttons: {
      contextButton: {
        enabled: false
      }
    }
  };
}
