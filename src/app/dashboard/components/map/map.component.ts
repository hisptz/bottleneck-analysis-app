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
  private _loaded: boolean;
  constructor(
    private store: Store<ApplicationState>
  ) {
    this._mapHasError = false;
  }


  get loaded(): boolean {
    return this._loaded;
  }

  set loaded(value: boolean) {
    this._loaded = value;
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
    this._loaded = this.visualizationObject.details.loaded;
  }

}
