import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {ChartConfiguration} from '../model/chart-configuration';
import {AnalyticsHeader, AnalyticsMetadata, AnalyticsObject} from '../model/analytics-object';

@Injectable()
export class VisualizerService {

  constructor() { }

  drawChart(incomingAnalyticsObject: any, chartConfiguration: ChartConfiguration): any {

    // TODO MOVE THIS LOGIC TO ANALYTICS OBJECT IN THE FUTURE
    const analyticsObject = this._sanitizeIncomingAnalytics(incomingAnalyticsObject);

    /**
     * Get generic chart object attributes
     * @type {{chart: any; title: any; subtitle: any; credits: any; colors: any[]; plotOptions: {}; tooltip: any; exporting: any}}
     */
    let chartObject = {
      chart: this._getChartAttributeOptions(chartConfiguration),
      title: this._getChartTitleObject(chartConfiguration),
      subtitle: this._getChartSubtitleObject(chartConfiguration),
      credits: this._getChartCreditsOptions(),
      colors: this._getChartColors(),
      plotOptions: this._getPlotOptions(chartConfiguration),
      tooltip: this._getTooltipOptions(chartConfiguration),
      exporting: this._getChartExportingOptions()
    };

    /**
     * Extend chart options depending on type
     */
    switch (chartConfiguration.type) {
      case 'spider_web':
        chartObject = this._extendSpiderWebChartOptions(chartObject, analyticsObject, chartConfiguration);
        break;
      case 'solidgauge':
        chartObject = this._extendSolidGaugeChartOptions(chartObject, analyticsObject, chartConfiguration);
        break;
      case 'gauge':
        chartObject = this._extendSolidGaugeChartOptions(chartObject, analyticsObject, chartConfiguration);
        break;
      case 'pie':
        chartObject = this._extendPieChartOptions(chartObject, analyticsObject, chartConfiguration);
        break;
      case 'multipleAxis':
        // console.log('multipleAxis');
        break;
      case 'combined':
        console.log('combined');
        break;
      default :
        chartObject = this._extendOtherChartOptions(chartObject, analyticsObject, chartConfiguration);
        break
    }

    // console.log(analyticsObject, configuration);
    return chartObject
  }

  private _extendSpiderWebChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.cloneDeep(initialChartObject);
    return newChartObject;
  }
  private _extendPieChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.cloneDeep(initialChartObject);

    const xAxisCategories: any[] = this._getAxisItems(analyticsObject, chartConfiguration.xAxisType);
    const yAxisSeriesItems: any[] = this._getAxisItems(analyticsObject, chartConfiguration.yAxisType);
    /**
     * Get series
     */
    newChartObject.series = _.clone(this._getChartSeries(
      analyticsObject,
      xAxisCategories,
      yAxisSeriesItems,
      chartConfiguration
    ));
    return newChartObject;
  }

  private _extendSolidGaugeChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.cloneDeep(initialChartObject);

    /**
     * Get pane options
     */
    newChartObject.pane = this._getPaneOptions();
    newChartObject.pane = this._getPaneOptions();

    return newChartObject;
  }
  private _extendStackedChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.cloneDeep(initialChartObject);
    return newChartObject;
  }
  private _extendOtherChartOptions(initialChartObject: any, analyticsObject: any, chartConfiguration: ChartConfiguration): any {
    const newChartObject = _.cloneDeep(initialChartObject);
    const xAxisCategories: any[] = this._getAxisItems(analyticsObject, chartConfiguration.xAxisType);
    const yAxisSeriesItems: any[] = this._getAxisItems(analyticsObject, chartConfiguration.yAxisType);

    /**
     * Get x axis options
     */
    newChartObject.xAxis = _.clone(this._getXAxisOptions(xAxisCategories.map(category => { return category.name})));

    /**
     * Get y axis options
     */
    newChartObject.yAxis = _.clone(this._getYAxisOptions(chartConfiguration));

    /**
     * Get series
     */
    newChartObject.series = _.clone(this._getChartSeries(
      analyticsObject,
      xAxisCategories,
      yAxisSeriesItems,
      chartConfiguration
    ));
    return newChartObject;
  }

  private _getChartSeries(
    analyticsObject: AnalyticsObject,
    xAxisItems: any[],
    yAxisItems: any[],
    chartConfiguration: ChartConfiguration
  ) {
    const series: any[] = [];
    if (yAxisItems) {
      yAxisItems.forEach((yAxisItem, yAxisIndex) => {
        series.push({
          name: yAxisItem.name,
          index: yAxisIndex,
          turboThreshold: 0,
          data: this._getSeriesData(
            analyticsObject,
            chartConfiguration,
            yAxisItem.id,
            xAxisItems
          ),
          type: this._getAllowedChartType(chartConfiguration.type)
        })
      })
    }
    return series;
  }

  private _getSeriesData(
    analyticsObject: AnalyticsObject,
    chartConfiguration: ChartConfiguration,
    yAxisItemId: string,
    xAxisItems: any[]
    ) {
    const data: any[] = [];
    /**
     * Get index to locate data for y axis
     */
    const yAxisItemIndex = _.findIndex(
      analyticsObject.headers,
      _.find(analyticsObject.headers, ['name', chartConfiguration.yAxisType]
      ));
    if (xAxisItems) {
      xAxisItems.forEach(xAxisItem => {
        /**
         * Get index to locate data for x axis
         */
        const xAxisItemIndex = _.findIndex(
          analyticsObject.headers,
          _.find(analyticsObject.headers, ['name', chartConfiguration.xAxisType]
          ));

        /**
         * Get index for value attribute to get the data
         */
        const dataIndex = _.findIndex(
          analyticsObject.headers,
          _.find(analyticsObject.headers, ['name', 'value']
          ));
        /**
         * Get the required data depending on xAxis and yAxis
         */
        for (const row of analyticsObject.rows) {
          if (row[yAxisItemIndex] === yAxisItemId && row[xAxisItemIndex] === xAxisItem.id) {
            data.push({
              id: xAxisItem.id,
              name: xAxisItem.name,
              dataLabels: this._getDataLabelsOptions(chartConfiguration),
              y: parseFloat(row[dataIndex])
            });
            break;
          }
        }
      })
    }
    return data;
  }

  private _getDataLabelsOptions(chartConfiguration: ChartConfiguration) {
    let dataLabels = null;

    switch (chartConfiguration.type) {
      case 'pie':
        dataLabels =  {
          enabled: chartConfiguration.showData,
            format: '{point.name}<br/> <b>{point.y}</b> ( {point.percentage:.1f} % )'
        };
        break;
      default:
        dataLabels = {
          enabled: chartConfiguration.showData
        };
        break;
    }

    return dataLabels;
  }
  private _getAxisItems(analyticsObject: any, axisType: string) {
    let items: any[] = [];
    const metadataNames = analyticsObject.metaData.names;
    const metadataDimensions = analyticsObject.metaData.dimensions;
    const itemKeys = metadataDimensions[axisType];
    if (itemKeys) {
      items = itemKeys.map(itemKey => {
        return {
          id: itemKey,
          name: metadataNames[itemKey]
        };
      })
    }
    return items;
  }

  private _getChartTitleObject(chartConfiguration: ChartConfiguration): any {

    if (chartConfiguration.hideTitle) {
      return null;
    }
    return {
      text: chartConfiguration.title,
        style: {
          color: '#269ABC',
          fontWeight: '600',
          fontSize: '13px'
      }
    }
  }

  private _getChartSubtitleObject(chartConfiguration: ChartConfiguration): any {

    if (chartConfiguration.hideSubtitle) {
      return null;
    }
    return {
      text: chartConfiguration.subtitle
    };
  }

  private _getChartCreditsOptions(): any {
    return {
      enabled: false
    };
  }

  private _getChartColors(): any[] {
    return [
      '#A9BE3B', '#558CC0', '#D34957', '#FF9F3A',
      '#968F8F', '#B7409F', '#FFDA64', '#4FBDAE',
      '#B78040', '#676767', '#6A33CF', '#4A7833',
      '#434348', '#7CB5EC', '#F7A35C', '#F15C80'
    ];
  }

  private _getChartExportingOptions(): any {
    return {
      buttons: {
        contextButton: {
          enabled: false
        }
      }
    };
  }

  private _getChartLabelOptions(chartConfiguration: ChartConfiguration) {
    return {

    }
  }

  private _getTooltipOptions(chartConfiguration: ChartConfiguration) {
    const tooltipChartType = this._getAllowedChartType(chartConfiguration.type);
    let tooltipObject: any = {};

    if (tooltipChartType) {
      switch (tooltipChartType) {
        case 'solidgauge':
          tooltipObject = {
            enabled: false
          };
          break;
        case 'pie':
          tooltipObject = {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          };
          break;
        default:
          switch (chartConfiguration.type) {
            case 'stacked_column':
              tooltipObject = {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
              };
              break;
            default:
              tooltipObject = {
                enabled: true
              };
              break;
          }
          break;
      }
    }
    return tooltipObject;
  }

  private _getPlotOptions(chartConfiguration: ChartConfiguration) {
    const plotOptionChartType = this._getAllowedChartType(chartConfiguration.type);
    const plotOptions = {};

    if (plotOptionChartType) {
      switch (plotOptionChartType) {
        case 'solidgauge':
          plotOptions[plotOptionChartType] = {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          };
          break;
        case 'gauge':
          plotOptions[plotOptionChartType] = {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          };
          break;
        case 'pie':
          plotOptions[plotOptionChartType] = {
            borderWidth: 0,
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: !chartConfiguration.hideLegend
          };
          break;
        default:
          plotOptions[plotOptionChartType] = {
            showInLegend: !chartConfiguration.hideLegend
          };

          /**
           * Set attributes for stacked charts
           */
          if (chartConfiguration.type === 'stacked_column' || chartConfiguration.type === 'stacked_bar') {
            plotOptions[plotOptionChartType].stacking = chartConfiguration.percentStackedValues ? 'percent' : 'normal';
          }
          break;
      }
    }
    return plotOptions;
  }

  private _getChartAttributeOptions(chartConfiguration: ChartConfiguration) {
    const chartOptions: any = {
      renderTo: chartConfiguration.renderId,
      type: this._getAllowedChartType(chartConfiguration.type)
    };

    /**
     * Extend Options depending on chart type
     */
    if (chartConfiguration.type === 'pie') {
      chartOptions.plotBackgroundColor = null;
      chartOptions.plotBorderWidth = null;
      chartOptions.plotShadow = false;
    }

    return chartOptions;
  }

  private _getPaneOptions() {
    return {
      center: ['50%', '85%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    }
  }

  private _getLegendOptions() {
    return {
      reversed: true
    }
  }

  private _getXAxisOptions(xAxisCategories: any[]) {
    return {
      categories: xAxisCategories,
      labels: {
        rotation: xAxisCategories.length <= 5 ? 0 : -45,
        style: {'color': '#000000', 'fontWeight': 'normal'}
      }
    };
  }

  private _getYAxisOptions(chartConfiguration: ChartConfiguration) {
    const yAxis = {
      min: 0,
      title: {
        text: ''
      }
    };

    /**
     * Get more options depending on chart type
     */
    switch (chartConfiguration.type) {
      case 'solidgauge':
        yAxis['stops'] = [
          [0.1, '#DF5353'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#55BF3B'] // red
        ];
        yAxis['lineWidth'] = 0;
        yAxis['minorTickInterval'] = null;
        yAxis['tickPixelInterval'] = 400;
        yAxis['tickWidth'] = 0;
        yAxis['labels'] = {
          y: 16
        };
        yAxis['max'] = 100;
        break;
      case 'stacked_column':
        yAxis['stackLabels'] = {
          enabled: false,
          style: {
            fontWeight: 'bold'
          }
        };
        break;
      default:
        yAxis['labels'] = {
          style: {'color': '#000000', 'fontWeight': 'bold'}
        };
        break;
    }
    return yAxis;
  }

  private _getInitialChartObject(type: string, chartConfiguration: ChartConfiguration): any {
    let initialChartObject = {};
    if (chartConfiguration) {

      /**
       * Set chart attribute
       */
      initialChartObject['chart'] = {
        renderTo: chartConfiguration.renderId,
        type: this._getAllowedChartType(chartConfiguration.type)
      };

      if (type === 'pie') {
        initialChartObject['chart'].plotBackgroundColor = null;
        initialChartObject['chart'].plotBorderWidth = null;
        initialChartObject['chart'].plotShadow = false;
      }

      /**
       * Set chart events
       */
      initialChartObject['events'] = {};

      /**
       * Get chart title
       */
      initialChartObject['title'] = {
        text: chartConfiguration.title,
        style: {
          color: '#269ABC',
          fontWeight: '600',
          fontSize: '13px'
        }
      };

      /**
       * Get chart subtitle
       */
      initialChartObject['subtitle'] = {
        text: chartConfiguration.subtitle
      };

      /**
       * disable credit
       */
      initialChartObject['credits'] = {
        enabled: false
      };

      /**
       * Set colors
       */
      initialChartObject['colors'] = [
        '#A9BE3B', '#558CC0', '#D34957', '#FF9F3A',
        '#968F8F', '#B7409F', '#FFDA64', '#4FBDAE',
        '#B78040', '#676767', '#6A33CF', '#4A7833',
        '#434348', '#7CB5EC', '#F7A35C', '#F15C80'
      ];

      /**
       * Set exporting features
       */
      initialChartObject['exporting'] = {
        buttons: {
          contextButton: {
            enabled: false
          }
        }
      };

      /**
       * Set plot options
       */
      initialChartObject['plotOptions'] = this._getPlotOptions(chartConfiguration);

      /**
       * Set tooltip
       */
      initialChartObject['tooltip'] = this._getTooltipOptions(chartConfiguration);

      /**
       * Set more options for different chart types
       */
      switch (type) {
        case 'stacked_column':
          initialChartObject = this._getMoreOptionsForStackedChartTypes(initialChartObject, chartConfiguration, 'column');
          break;
        case 'stacked_bar':
          initialChartObject = this._getMoreOptionsForStackedChartTypes(initialChartObject, chartConfiguration, 'bar');
          break;
        case 'solidgauge':
          initialChartObject = this._getMoreOptionsForSolidGaugeChartTypes(initialChartObject, chartConfiguration);
          break;
        case 'pie':
          initialChartObject = this._getMoreOptionsPieChartTypes(initialChartObject, chartConfiguration);
          break;
        default:
          initialChartObject = this._getMoreOptionsForDefaultChartTypes(initialChartObject, chartConfiguration);
          break;
      }
    }

    return initialChartObject;
  }

  private _getAllowedChartType(chartType: string): string {
    const splitedChartType: any[] = chartType.split('_');
    return splitedChartType.length > 1 ? splitedChartType[1] : splitedChartType[0];
  }

  private _getMoreOptionsPieChartTypes(initialChartObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.cloneDeep(initialChartObject);
    return newChartObject;
  }

  private _getMoreOptionsForSolidGaugeChartTypes(initialChartObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.cloneDeep(initialChartObject);

    /**
     * Set pane attribute
     */
    newChartObject.pane = {
      center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
        backgroundColor: '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
      }
    };

    /**
     * Set initial yAxis attributes
     */
    newChartObject.yAxis = {
      stops: [
        [0.1, '#DF5353'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#55BF3B'] // red
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickPixelInterval: 400,
      tickWidth: 0,
      labels: {
        y: 16
      },
      min: 0,
      max: 100,
      title: {
        text: ''
      }
    };

    return newChartObject;
  }
  private _getMoreOptionsForStackedChartTypes(initialChartObject: any, chartConfiguration: ChartConfiguration, stackedType: string) {
    const newChartObject = _.cloneDeep(initialChartObject);

    /**
     * Set initial xAxis attributes
     */
    newChartObject.xAxis =  {
      categories: []
    };

    /**
     * Set initial yAxis attributes
     */
    newChartObject.yAxis = {
      min: 0,
      title: {
        text: ''
      },
      stackLabels: {
        enabled: chartConfiguration.showLabels,
        style: {
          fontWeight: 'bold'
        }
      }
    };


    if (stackedType === 'bar') {

      /**
       * Set legend for bar stacked charts
       */
      newChartObject.legend = {
        reversed: true
      }
    }
    return newChartObject;
  }

  private _getMoreOptionsForDefaultChartTypes(initialChartObject: any, chartConfiguration: ChartConfiguration) {
    const newChartObject = _.cloneDeep(initialChartObject);

    /**
     * Set initial xAxis attributes
     */
    newChartObject.xAxis =  {
      categories: [],
      labels: {
        rotation: -45,
        style: {'color': '#000000', 'fontWeight': 'normal'}
      }
    };

    /**
     * Set initial yAxis attributes
     */
    newChartObject.yAxis = {
      min: 0,
      title: {
        text: ''
      },
      labels: {
        style: {'color': '#000000', 'fontWeight': 'bold'}
      }
    };

    return newChartObject;
  }

  // prepareCategories ( analyticsObject, xAxis: string, yAxis: string, xAxisItems = [],  yAxisItems = []){
  //   let structure = {
  //     'xAxisItems':[],
  //     'yAxisItems':[]
  //   };
  //   if(xAxisItems.length === 0){
  //     for ( let val of this.getMetadataArray(analyticsObject,xAxis )){
  //       structure.xAxisItems.push( {'name':analyticsObject.metaData.names[val], 'uid': val} );
  //     }
  //   }if ( xAxisItems.length !== 0 ) {
  //     for ( let val of xAxisItems ){
  //       structure.xAxisItems.push( {'name': analyticsObject.metaData.names[val], 'uid': val} );
  //     }
  //   }
  //   if ( yAxisItems.length !== 0 ) {
  //     for ( let val of yAxisItems ){
  //       structure.yAxisItems.push( {'name': analyticsObject.metaData.names[val] , 'uid': val} );
  //     }
  //   }
  //   if( yAxisItems.length === 0 ){
  //     for (let val of this.getMetadataArray(analyticsObject,yAxis) ){
  //       structure.yAxisItems.push( {'name': analyticsObject.metaData.names[val], 'uid': val} );
  //     }
  //   }
  //   return structure;
  // }

  private _sanitizeIncomingAnalytics(analyticsObject: any) {
    const sanitizedAnalyticsObject: AnalyticsObject = {
      headers: [],
      metaData: {
        names: null,
        dimensions: null
      },
      rows: []
    };

    if (analyticsObject) {
      /**
       * Check headers
       */
      if (analyticsObject.headers) {
        analyticsObject.headers.forEach((header: any) => {
          try {
            const newHeader: AnalyticsHeader = header;
            sanitizedAnalyticsObject.headers.push(newHeader);
          } catch (e) {
            console.warn('Invalid header object')
          }
        });
      }

      /**
       * Check metaData
       */
      if (analyticsObject.metaData) {

        try {
          const sanitizedMetadata: AnalyticsMetadata = this._getSanitizedAnalyticsMetadata(analyticsObject.metaData);
          sanitizedAnalyticsObject.metaData = sanitizedMetadata;
        } catch (e) {
          console.warn('Invalid metadata object')
        }
      }

      /**
       * Check rows
       */
      if (analyticsObject.rows) {
        sanitizedAnalyticsObject.rows = analyticsObject.rows;
      }

    }

    return sanitizedAnalyticsObject;
  }

  private _getSanitizedAnalyticsMetadata(analyticMetadata: any) {
    const sanitizedMetadata: AnalyticsMetadata = {
      names: null,
      dimensions: null
    };

    if (analyticMetadata) {

      /**
       * Get metadata names
       */
      if (analyticMetadata.names) {
        sanitizedMetadata.names = analyticMetadata.names;
      } else if (analyticMetadata.items) {
        const metadataItemsKeys = _.keys(analyticMetadata.items);
        const metadataNames: any = {};
        if (metadataItemsKeys) {
          metadataItemsKeys.forEach(metadataItemKey => {
            metadataNames[metadataItemKey] = analyticMetadata.items[metadataItemKey].name;
          })
        }
        sanitizedMetadata.names = metadataNames;
      }

      /**
       * Get metadata dimensions
       */
      if (analyticMetadata.dimensions) {
        sanitizedMetadata.dimensions = analyticMetadata.dimensions;
      } else {
        const metadataKeys = _.keys(analyticMetadata);
        const metadataDimensions: any = {};
        if (metadataKeys) {
          metadataKeys.forEach(metadataKey => {
            if (metadataKey !== 'names') {
              metadataDimensions[metadataKey] = analyticMetadata[metadataKey];
            }
          });
        }
        sanitizedMetadata.dimensions = metadataDimensions;
      }
    }

    return sanitizedMetadata;
  }

}
