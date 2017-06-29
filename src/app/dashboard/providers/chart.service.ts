import { Injectable } from '@angular/core';
import {ChartConfiguration} from '../model/chart-configuration';
import {Visualization} from '../model/visualization';
import {VisualizationService} from './visualization.service';

@Injectable()
export class ChartService {

  constructor(
    private visualizationService: VisualizationService
  ) { }

  public getChartObjects(visualizationObject: Visualization, chartType: string = null): any[] {

    return visualizationObject.layers.map((layer, index) => {
      const renderId: string = visualizationObject.id + '_' + index;
      /**
       * Include custom chart type if any
       */
      if (chartType != null) {
        layer.settings.chartConfiguration.type = chartType;
      }

      let chartObject = null;
      if (layer.analytics) {
        chartObject = this.visualizationService.drawChart(layer.analytics, layer.settings.chartConfiguration);
        chartObject.chart.renderTo = renderId;
      }

      return {id: layer.settings.id, content: chartObject};
    })
  }

  getChartConfiguration(visualizationSettings: any): ChartConfiguration[] {
    const chartConfigurations = [];
    visualizationSettings.forEach(favoriteObject => {
      const chartConfiguration = {
        type: favoriteObject.hasOwnProperty('type') ? favoriteObject.type.toLowerCase() : 'bar',
        title: favoriteObject.hasOwnProperty('displayName') ? favoriteObject.displayName : '',
        subtitle: favoriteObject.hasOwnProperty('subtitle') ? favoriteObject.subtitle : '',
        hideTitle: favoriteObject.hasOwnProperty('hideTitle') ? favoriteObject.hideTitle : true,
        hideSubtitle: favoriteObject.hasOwnProperty('hideSubtitle') ? favoriteObject.hideSubtitle : true,
        showData: favoriteObject.hasOwnProperty('showData') ? favoriteObject.showData : true,
        hideEmptyRows: favoriteObject.hasOwnProperty('hideEmptyRows') ? favoriteObject.hideEmptyRows : true,
        xAxisType: this._getAxisType('xAxisType', favoriteObject),
        yAxisType: this._getAxisType('yAxisType', favoriteObject),
      };
      chartConfigurations.push({id: favoriteObject.id, chartConfiguration: chartConfiguration})
    });
    return chartConfigurations;
  }

  private _getAxisType(axis, favoriteObject) {
    let axisType = '';
    if (axis === 'xAxisType') {
      if (favoriteObject.hasOwnProperty('category')) {
        axisType = favoriteObject.category;
      } else if (favoriteObject.hasOwnProperty('rows') && favoriteObject.rows.length > 0) {
        axisType = favoriteObject.rows[0].dimension;
      } else {
        axisType = 'dx'
      }
    } else {
      if (favoriteObject.hasOwnProperty('series')) {
        axisType = favoriteObject.series;
      } else if (favoriteObject.hasOwnProperty('columns') && favoriteObject.columns.length > 0) {
        axisType = favoriteObject.columns[0].dimension;
      } else {
        axisType = 'ou'
      }
    }
    return axisType;
  }

}
