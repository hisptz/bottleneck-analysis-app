import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Visualization} from '../../model/visualization';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../store/application-state';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import * as _ from 'lodash';
import 'leaflet';
import 'leaflet.markercluster';
declare var L;
import {MapTemplateComponent} from "../map-template/map-template.component";
import {VisualizationObjectService} from '../../providers/visualization-object.service';
import {GeoFeatureService} from '../../providers/geo-feature.service';
import {Observable} from 'rxjs/Observable';
import {MapService} from '../../providers/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  @Input() downloadOptions: any;
  mapHasError: boolean;
  errorMessage: string;
  loaded: boolean;
  @ViewChild(MapTemplateComponent)
  mapTemplateComponent: MapTemplateComponent;
  constructor(
    private visualizationObjectService: VisualizationObjectService,
    private geoFeatureService: GeoFeatureService,
    private mapService: MapService,
    private store: Store<ApplicationState>
  ) {
    this.mapHasError = false;
  }

  downLoadFiles(fileFormat){
    this.mapTemplateComponent.downloadMap(fileFormat);
  }

  ngOnInit() {
    this.mapHasError = this.visualizationObject.details.hasError;
    this.errorMessage = this.visualizationObject.details.errorMessage;
    this.loaded = this.visualizationObject.details.loaded;
  }



}
