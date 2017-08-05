import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../store/application-state';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import * as _ from 'lodash';
import 'leaflet';
import 'leaflet.markercluster';
declare var L;
import {
  GetMapConfigurationAction, GetMapObjectAction, LoadGeoFeatureAction, LoadLegendSetAction,
  LoadOrgUnitGroupSetAction, SplitVisualizationObjectAction, VisualizationObjectOptimizedAction
} from '../../../store/actions';
import {MapVisualizationService} from '../../providers/map-visualization.service';
import {TileLayers} from '../../constants/tile-layers';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _mapHasError: boolean;
  private _errorMessage: string;
  constructor(
    private store: Store<ApplicationState>
  ) {
    this._mapHasError = false;
  }


  get mapHasError(): boolean {
    return this._mapHasError;
  }

  set mapHasError(value: boolean) {
    this._mapHasError = value;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  set errorMessage(value: string) {
    this._errorMessage = value;
  }

  ngOnInit() {
    this._mapHasError = this.visualizationObject.details.hasError;
    this._errorMessage = this.visualizationObject.details.errorMessage;
    if (
      !this.visualizationObject.details.loaded
      && this.visualizationObject.layers.length > 0
      && this.visualizationObject.details.analyticsLoaded
    ) {
      /**
       * Split visualization Object
       */
      if (this.visualizationObject.details.type !== 'MAP' && !this.visualizationObject.details.splited) {

        this.store.dispatch(new SplitVisualizationObjectAction(this.visualizationObject));
      } else if (this.visualizationObject.details.type === 'MAP') {
        this.store.dispatch(new VisualizationObjectOptimizedAction(this.visualizationObject))
      }

      if (this.visualizationObject.details.visualizationOptimized) {

        /**
         * Get map configuration
         */
        this.store.dispatch(new GetMapConfigurationAction(this.visualizationObject));

        this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
          if (apiRootUrl !== '') {
            /**
             * Load geo features
             */
            this.store.dispatch(new LoadGeoFeatureAction({apiRootUrl: apiRootUrl, visualizationObject: this.visualizationObject}));
          }
        });
      }
    }
  }

}
