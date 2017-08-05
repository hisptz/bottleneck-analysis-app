import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ChartTemplateComponent} from '../chart-template/chart-template.component';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {
  ChartTypeChangeAction,
  GetChartConfigurationAction, GetChartObjectAction,
  MergeVisualizationObjectAction, VisualizationObjectOptimizedAction
} from '../../../store/actions';
import {Visualization} from '../../model/visualization';
import {CHART_TYPES} from '../../constants/chart';
import * as _ from 'lodash';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @ViewChild(ChartTemplateComponent)
  chartTemplate: ChartTemplateComponent;
  private _showOptions: boolean;
  private _chartTypes: any[];
  private _loaded: boolean;
  private _chartHasError: boolean;
  private _errorMessage: string;
  private _chartObjects: any;
  private _chartHeight: string;
  constructor(private store: Store<ApplicationState>) {
    this._chartTypes = CHART_TYPES;
    this._showOptions = false;
    this._loaded = false;
    this._chartHasError = false;
    this._chartObjects = [];
  }

  ngOnInit() {
    this._loaded = this.visualizationObject.details.loaded;
    this._chartHasError = this.visualizationObject.details.hasError;
    this._errorMessage = this.visualizationObject.details.errorMessage;
    this._chartHeight = this.visualizationObject.details.itemHeight;

    /**
     * Get chart objects
     */
    if (this.visualizationObject.details.loaded) {
      const newChartObjects  = _.map(this.visualizationObject.layers, (layer) => { return layer.chartObject });
      this._chartObjects =_.filter(newChartObjects, (chartObject) => {
        return chartObject !== undefined
      });
      // console.log(JSON.stringify(this._chartObjects))
    }

    if (
      !this.visualizationObject.details.loaded
      && this.visualizationObject.layers.length > 0
      && this.visualizationObject.details.analyticsLoaded
    ) {

      /**
       * Merge visualization Object
       */

      // if ((this.visualizationObject.details.type !== 'CHART' || this.visualizationObject.details.type !== 'TABLE') && !this.visualizationObject.details.merged) {
      //   this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      //     if (apiRootUrl !== '') {
      //       this.store.dispatch(new MergeVisualizationObjectAction({
      //         apiRootUrl: apiRootUrl,
      //         visualizationObject: this.visualizationObject
      //       }));
      //     }
      //   });
      // }

      if (this.visualizationObject.details.type === 'CHART') {
        this.store.dispatch(new VisualizationObjectOptimizedAction(this.visualizationObject))
      } else if (this.visualizationObject.details.type !== 'CHART' && !this.visualizationObject.details.merged) {
        this.store.dispatch(new MergeVisualizationObjectAction(this.visualizationObject))
      }

      if (this.visualizationObject.details.visualizationOptimized) {
        /**
         * Get chart configuration
         */
        this.store.dispatch(new GetChartConfigurationAction({
          visualizationObjectId: this.visualizationObject.id,
          visualizationSettings: this.visualizationObject.layers.map(layer => { return layer.settings})
        }));

        /**
         * Get chart object
         */
        this.store.dispatch(new GetChartObjectAction(this.visualizationObject));
      }
    }

  }


  get chartHeight(): string {
    return this._chartHeight;
  }

  set chartHeight(value: string) {
    this._chartHeight = value;
  }

  get chartObjects(): any {
    return this._chartObjects;
  }

  set chartObjects(value: any) {
    this._chartObjects = value;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  set errorMessage(value: string) {
    this._errorMessage = value;
  }

  get chartHasError(): boolean {
    return this._chartHasError;
  }

  set chartHasError(value: boolean) {
    this._chartHasError = value;
  }

  get loaded(): boolean {
    return this._loaded;
  }

  set loaded(value: boolean) {
    this._loaded = value;
  }

  get chartTypes(): any[] {
    return this._chartTypes;
  }

  set chartTypes(value: any[]) {
    this._chartTypes = value;
  }


  get showOptions(): boolean {
    return this._showOptions;
  }

  set showOptions(value: boolean) {
    this._showOptions = value;
  }

  toggleOptions(event) {
    if (event === 'mouseenter') {
      this._showOptions = this.visualizationObject.details.showChartOptions ? true : false;
    } else {
      this._showOptions = false;
    }
  }

  resize(shape?) {
    if (this.chartTemplate) {
      this.chartTemplate.reflow(shape ? shape : this.visualizationObject.shape, this.visualizationObject.details.showFullScreen);
    }
  }

  download(downloadFormat) {
    if (this.chartTemplate) {
      this.chartTemplate.download(this.visualizationObject.name, downloadFormat);
    }
  }

  updateChartType(chartType) {
    this.store.dispatch(new ChartTypeChangeAction({
      visualizationObject: this.visualizationObject,
      chartType: chartType
    }))
  }

  getChartError(errorMessage: string) {
    this._chartHasError = true;
    this._errorMessage = errorMessage;
  }

}
