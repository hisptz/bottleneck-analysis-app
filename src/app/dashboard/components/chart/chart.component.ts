import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ChartTemplateComponent} from '../chart-template/chart-template.component';
import {Visualization} from '../../model/visualization';
import {CHART_TYPES} from '../../constants/chart';
import * as _ from 'lodash';
import {ChartService} from '../../providers/chart.service';
import {VisualizationObjectService} from '../../providers/visualization-object.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @ViewChild(ChartTemplateComponent)
  chartTemplate: ChartTemplateComponent;
  @Output() onChartTypeChange = new EventEmitter();
  showOptions: boolean;
  chartTypes: any[];
  loaded: boolean;
  chartHasError: boolean;
  errorMessage: string;
  chartObjects: any;
  chartHeight: string;
  currentChartType: string;
  constructor(
    private chartService: ChartService,
    private visualizationObjectService: VisualizationObjectService
  ) {
    this.chartTypes = CHART_TYPES;
    this.showOptions = false;
    this.loaded = false;
    this.chartHasError = false;
    this.chartObjects = [];
    this.currentChartType = '';
  }

  ngOnInit() {
    this.loaded = this.visualizationObject.details.loaded;
    this.chartHasError = this.visualizationObject.details.hasError;
    this.errorMessage = this.visualizationObject.details.errorMessage;
    this.chartHeight = this.visualizationObject.details.itemHeight;
    this.showOptions = this.visualizationObject.details.showChartOptions;
    /**
     * Get chart objects
     */
    if (this.visualizationObject.details.loaded) {
      this.chartObjects = this.getChartObjects(this.visualizationObject, this.currentChartType)
    }

  }

  getChartObjects(visualizationObject: Visualization, chartType: string = '') {
    return visualizationObject.layers.map((layer, index) => {
      const settings = {...layer.settings};
      const layoutObject = _.find(visualizationObject.details.layout, ['id', settings.id]);
      let chartObject = null;

      if (layoutObject) {
        chartObject = this.chartService.getChartObject(
          layer.analytics,
          this.chartService.getChartConfiguration(
            settings,
            visualizationObject.id + '_' + index,
            layoutObject.layout,
            chartType
          ));
      }

      return chartObject
    }).filter((chartObject) => chartObject !== null);
  }

  toggleOptions(event) {
    if (event === 'mouseenter') {
      this.showOptions = this.visualizationObject.details.showChartOptions ? true : false;
    } else {
      this.showOptions = false;
    }
    console.log(this.showOptions)
  }

  resize(shape: string, fullScreen: boolean, height: string) {
    if (this.chartTemplate) {
      this.chartTemplate.reflow(shape, fullScreen, height);
    }
  }

  download(downloadFormat) {
    if (this.chartTemplate) {
      this.chartTemplate.download(this.visualizationObject.name, downloadFormat);
    }
  }

  updateChartType(chartType: string, e) {
    e.stopPropagation();
    this.currentChartType = chartType;
    this.onChartTypeChange.emit(chartType);
  }

  getChartError(errorMessage: string) {
    this.chartHasError = true;
    this.errorMessage = errorMessage;
  }

}
