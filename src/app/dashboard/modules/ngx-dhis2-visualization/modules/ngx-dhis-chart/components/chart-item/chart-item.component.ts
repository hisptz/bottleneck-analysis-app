import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
declare var require: any;
const HighchartsGroupedCategories = require('highcharts-grouped-categories')(
    Highcharts
  ),
  HighchartsExporting = require('highcharts/modules/exporting')(Highcharts),
  OfflineHighchartExporting = require('highcharts/modules/offline-exporting.js')(
    Highcharts
  ),
  HighchartsExportData = require('highcharts/modules/export-data')(Highcharts),
  HighchartsMore = require('highcharts/highcharts-more.js')(Highcharts),
  HighchartGauge = require('highcharts/modules/solid-gauge.js')(Highcharts),
  HighchartDrilldown = require('highcharts/modules/drilldown.js')(Highcharts);

import { ChartConfiguration } from '../../models/chart-configuration.model';
import { ChartType } from '../../models/chart-type.model';
import { CHART_TYPES } from '../../constants/chart-types.constant';

import { getChartObject } from '../../helpers';
import { VisualizationExportService } from '../../../../services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-chart-item',
  templateUrl: './chart-item.component.html',
  styleUrls: ['./chart-item.component.css'],
})
export class ChartItemComponent implements OnInit {
  @Input()
  chartConfiguration: ChartConfiguration;
  @Input()
  analyticsObject: any;
  @Input()
  chartHeight: string;

  @Output()
  chartUpdate: EventEmitter<any> = new EventEmitter<any>();
  showOptions: boolean;
  chartTypes: ChartType[];
  chart: any;
  currentChartType: string;
  renderId: string;

  constructor(private visualizationExportService: VisualizationExportService) {
    this.chartTypes = CHART_TYPES;
    this.showOptions = false;
  }

  ngOnInit() {
    if (this.chartConfiguration) {
      this.currentChartType = this.chartConfiguration.type;
      this.renderId = this.chartConfiguration.renderId;
      this.drawChart(this.analyticsObject, this.chartConfiguration);
    }
  }

  drawChart(analyticsObject, chartConfiguration): void {
    if (chartConfiguration && analyticsObject) {
      const chartObject: any = getChartObject(
        analyticsObject,
        chartConfiguration
      );

      if (chartObject) {
        setTimeout(() => {
          this.chart = Highcharts.chart(chartObject);
        }, 20);
      }
    }
  }

  updateChartType(chartType: string, e) {
    e.stopPropagation();
    this.currentChartType = chartType;
    this.drawChart(this.analyticsObject, {
      ...this.chartConfiguration,
      type: chartType,
    });
    this.chartUpdate.emit({
      id: this.renderId,
      type: chartType.toUpperCase(),
    });
  }

  onFocus(parentEvent) {
    if (parentEvent.focused) {
      this.showOptions = true;
    } else {
      this.showOptions = false;
    }
  }

  downloadChart(downloadFormat, downloadFilename) {
    const date = new Date();
    const filename = `bottleneck chart - ${downloadFilename}`;
    if (this.chart) {
      if (downloadFormat === 'PDF') {
        this.chart.exportChartLocal({
          filename: filename,
          type: 'application/pdf',
        });
      } else if (downloadFormat === 'PNG') {
        this.chart.exportChartLocal({ filename: filename, type: 'image/png' });
      } else if (downloadFormat === 'JPEG') {
        this.chart.exportChartLocal({ filename: filename, type: 'image/jpeg' });
      } else if (downloadFormat === 'SVG') {
        this.chart.exportChartLocal({
          filename: filename,
          type: 'image/svg+xml',
        });
      } else if (downloadFormat === 'CSV') {
        this.visualizationExportService.exportCSV(
          filename,
          '',
          this.chart.getCSV()
        );
      } else if (downloadFormat === 'XLS') {
        this.visualizationExportService.exportXLS(
          filename,
          this.chart.getTable()
        );
      }
    }
  }
}
