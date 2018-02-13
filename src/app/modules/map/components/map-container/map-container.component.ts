import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  Input,
  AfterViewInit
} from '@angular/core';
import { VisualizationObject } from '../../models/visualization-object.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import { getTileLayer } from '../../constants/tile-layer.constant';
import { MapConfiguration } from '../../models/map-configuration.model';
import { GeoFeature } from '../../models/geo-feature.model';
import * as fromLib from '../../lib';
import * as L from 'leaflet';

import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { map, filter, tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-map-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css'],
  styles: [
    `:host {
      display: block;
      width: 100%;
      height: 100%;
    }
  }`
  ]
})
export class MapContainerComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() visualizationObject: VisualizationObject;
  @Input() displayConfigurations: any;

  public visualizationLegendIsOpen$: Observable<boolean>;
  public mapHasGeofeatures: boolean = true;
  public mapHasDataAnalytics: boolean = true;
  private _visualizationObject: VisualizationObject;
  private _displayConfigurations: any;

  public map: any;

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnChanges(changes: SimpleChanges) {
    const { visualizationObject, displayConfigurations } = changes;
    this._visualizationObject = visualizationObject.currentValue;
    this.createMap();
    // detect changes and redraw only after ngInit has done that.
    if (!visualizationObject.isFirstChange()) {
      this.drawMap(this._visualizationObject);
    }
  }

  ngOnInit() {
    this.visualizationLegendIsOpen$ = this.store.select(
      fromStore.isVisualizationLegendOpen(this._visualizationObject.componentId)
    );
  }

  createMap() {
    const { geofeatures, analytics } = this._visualizationObject;
    const allGeofeatures = Object.keys(geofeatures).map(key => geofeatures[key]);
    const allDataAnalytics = Object.keys(analytics).filter(key => analytics[key] && analytics[key].rows.length > 0);
    if (![].concat.apply([], allGeofeatures).length) {
      this.mapHasGeofeatures = false;
    }

    if (!allDataAnalytics.length) {
      this.mapHasDataAnalytics = false;
    }
  }

  ngAfterViewInit() {
    this.initializeMapContainer();
    interval(4)
      .take(1)
      .subscribe(() => this.drawMap(this._visualizationObject));
  }

  initializeMapContainer() {
    const { itemHeight, mapWidth } = this.displayConfigurations;
    const fullScreen = this._visualizationObject.mapConfiguration.fullScreen || itemHeight === '100vh';
    const container = fromUtils.prepareMapContainer(this._visualizationObject.componentId, itemHeight, mapWidth, false);
    const otherOptions = {
      zoomControl: false,
      scrollWheelZoom: fullScreen ? true : false,
      worldCopyJump: true
    };
    this.map = L.map(container, otherOptions);
  }

  createLayer(optionsLayer, index) {
    const { displaySettings, id, geoJsonLayer, visible } = optionsLayer;
    this.createPane(displaySettings.labels, id, index);
    this.setLayerVisibility(visible, geoJsonLayer);
  }

  createPane(labels, id, index) {
    const zIndex = 600 - index * 10;
    this.map.createPane(id);
    this.map.getPane(id).style.zIndex = zIndex.toString();

    if (labels) {
      const paneLabelId = `${id}-labels`;
      const labelPane = this.map.createPane(paneLabelId);
      this.map.getPane(paneLabelId).style.zIndex = (zIndex + 1).toString();
    }
  }

  onLayerAdd(index, optionsLayer) {}

  setLayerVisibility(isVisible, layer) {
    if (isVisible && this.map.hasLayer(layer) === false) {
      this.map.addLayer(layer);
    } else if (!isVisible && this.map.hasLayer(layer) === true) {
      this.map.removeLayer(layer);
    }
  }

  layerFitBound(bounds: L.LatLngBoundsExpression) {
    this.map.fitBounds(bounds);
  }

  zoomIn(event) {
    this.map.zoomIn();
  }

  zoomOut(event) {
    this.map.zoomOut();
  }

  recenterMap(event) {
    this.map.eachLayer(layer => {});
  }

  toggleLegendContainerView() {
    this.store.dispatch(new fromStore.ToggleOpenVisualizationLegend(this._visualizationObject.componentId));
  }
  initializeMapBaseLayer(mapConfiguration: MapConfiguration) {
    let center: L.LatLngExpression = [
      Number(fromLib._convertLatitudeLongitude(mapConfiguration.latitude)),
      Number(fromLib._convertLatitudeLongitude(mapConfiguration.longitude))
    ];
    if (!mapConfiguration.latitude && !mapConfiguration.longitude) {
      center = [6.489, 21.885];
    }
    const zoom = mapConfiguration.zoom ? mapConfiguration.zoom : 6;

    const mapTileLayer = getTileLayer(mapConfiguration.basemap);
    const baseMapLayer = fromLib.LayerType[mapTileLayer.type](mapTileLayer);

    this.map.setView(center, zoom, { reset: true });
    // Add baseMap Layer;
    this.map.addLayer(baseMapLayer);
  }

  drawMap(visualizationObject: VisualizationObject) {
    const overlayLayers = fromLib.GetOverLayLayers(visualizationObject);
    this.initializeMapBaseLayer(visualizationObject.mapConfiguration);
    const layersBounds = [];
    let legendSets = [];
    overlayLayers.map((layer, index) => {
      const { bounds, legendSet } = layer;
      if (bounds) {
        layersBounds.push(bounds);
      }
      if (legendSet && legendSet.legend) {
        legendSet.hidden = false;
        legendSets = [...legendSets, legendSet];
      }
      this.createLayer(layer, index);
    });

    if (layersBounds.length) {
      this.layerFitBound(layersBounds);
    }
    if (legendSets.length) {
      this.store.dispatch(new fromStore.AddLegendSet({ [this._visualizationObject.componentId]: legendSets }));
    }
  }
}
