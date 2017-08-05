import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {
  GetTableConfigurationAction, GetTableObjectAction, LoadLegendSetAction,
  MergeVisualizationObjectAction, VisualizationObjectOptimizedAction
} from '../../../store/actions';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import * as _ from 'lodash';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _tableHasError: boolean;
  private _errorMessage: string;
  private _tableObjects: any[];
  private _loaded: boolean;

  constructor(private store: Store<ApplicationState>) {
    this._tableHasError = false;
    this._tableObjects = [];
    this._loaded = false;
  }


  get loaded(): boolean {
    return this._loaded;
  }

  set loaded(value: boolean) {
    this._loaded = value;
  }

  get tableObjects(): any[] {
    return this._tableObjects;
  }

  set tableObjects(value: any[]) {
    this._tableObjects = value;
  }

  get tableHasError(): boolean {
    return this._tableHasError;
  }

  set tableHasError(value: boolean) {
    this._tableHasError = value;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  set errorMessage(value: string) {
    this._errorMessage = value;
  }

  getCellColorValue(settings, tableCellValue) {
    let cellColor = '';
    if (!settings.hasOwnProperty('legendSet')) {
      return '';
    } else {
      const legends = settings.legendSet.legends;
      if (isNaN(tableCellValue)) {
        return '';
      }
      legends.forEach(legend => {
        if (legend.startValue <= tableCellValue && legend.endValue > tableCellValue) {
          cellColor = legend.color;
          return;
        }
      })
      return cellColor;
    }

  }

  ngOnInit() {
    this._tableHasError = this.visualizationObject.details.hasError;
    this._errorMessage = this.visualizationObject.details.errorMessage;
    this._loaded = this.visualizationObject.details.loaded;

    if (this.visualizationObject.layers.length > 0) {
      const newTableObjects  = _.map(this.visualizationObject.layers, (layer) => { return layer.tableObject });
      this._tableObjects =_.filter(newTableObjects, (tableObject) => {
          return tableObject !== undefined
        });
    }

    if (
      !this.visualizationObject.details.loaded
      && this.visualizationObject.layers.length > 0
      && this.visualizationObject.details.analyticsLoaded
    ) {
      /**
       * Merge visualization Object
       */
      if (this.visualizationObject.details.type === 'TABLE') {
        this.store.dispatch(new VisualizationObjectOptimizedAction(this.visualizationObject))
      } else if (this.visualizationObject.details.type !== 'CHART' && !this.visualizationObject.details.merged) {
        console.log('merge')
      }

      if (this.visualizationObject.details.visualizationOptimized) {

        this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
          if (apiRootUrl !== '') {
            this.store.dispatch(new LoadLegendSetAction({
              apiRootUrl: apiRootUrl,
              visualizationObject: this.visualizationObject
            }))
          }
        });

        /**
         * Get table configuration
         */
        this.store.dispatch(new GetTableConfigurationAction({
          visualizationObjectId: this.visualizationObject.id,
          visualizationSettings: this.visualizationObject.layers.map(layer => {
            return layer.settings
          }),
          visualizationType: this.visualizationObject.type,
          visualizationLayout: this.visualizationObject.details.layouts
        }));

        /**
         * Get table object
         */
        this.store.dispatch(new GetTableObjectAction(this.visualizationObject))
      }

    }
  }

}
