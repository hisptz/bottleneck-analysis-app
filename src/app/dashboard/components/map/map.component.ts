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
  LoadOrgUnitGroupSetAction
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
  constructor(
    private store: Store<ApplicationState>,
    private mapVisualizationService: MapVisualizationService,
    private tileLayers: TileLayers
  ) { }

  ngOnInit() {
    if (!this.visualizationObject.details.loaded) {
      if (this.visualizationObject.layers.length > 0) {
        /**
         * Get map configuration
         */
        this.store.dispatch(new GetMapConfigurationAction(this.visualizationObject))

        if (this.visualizationObject.details.analyticsLoaded) {
            this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
              if (apiRootUrl !== '') {
                /**
                 * Load geo features
                 */
                this.store.dispatch(new LoadGeoFeatureAction({apiRootUrl: apiRootUrl, visualizationObject: this.visualizationObject}));
              }
            })
        }

      }
    }
  }

}
