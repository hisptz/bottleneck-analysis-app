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
import { getTileLayer } from '../../constants/tile-layer.constant';
import { MapConfiguration } from '../../models/map-configuration.model';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import * as fromStore from '../../store';
import * as fromLib from '../../lib';
import * as fromUtils from '../../utils';
import * as L from 'leaflet';
import * as _ from 'lodash';

@Component({
  selector: 'hisptz-map-visualizer',
  templateUrl: './map-visualizer.component.html',
  styleUrls: ['./map-visualizer.component.css']
})
export class MapVisualizerComponent implements OnChanges {
  @Input() visualizationObject: VisualizationObject;
  @Input() displayConfigurations: any;
  @Input() visualizationLegendIsOpen: boolean;
  @Input() isDataTableOpen: boolean;
  @Input() baselayerLegend: any;
  @Input() currentLegendSets: any;

  private leafletLayers: any = {};
  private layersBounds;
  private basemap: any;
  private _baseLayerLegend;
  private _currentLegendSets;

  public mapHasGeofeatures: boolean = true;
  public mapHasDataAnalytics: boolean = true;
  public map: any;
  mapHeight: string;

  constructor(private store: Store<fromStore.MapState>) {}
  ngOnChanges(changes: SimpleChanges) {
    const {
      visualizationObject,
      displayConfigurations,
      baselayerLegend,
      currentLegendSets
    } = changes;
    this.createMap();
    if (currentLegendSets && currentLegendSets.currentValue) {
      this._currentLegendSets = currentLegendSets.currentValue;
    }
    if (baselayerLegend && baselayerLegend.currentValue) {
      this._baseLayerLegend = baselayerLegend.currentValue;
    }

    if (
      visualizationObject &&
      !visualizationObject.isFirstChange() &&
      visualizationObject.previousValue !== visualizationObject.currentValue
    ) {
      this.redrawMapOndataChange(visualizationObject.currentValue);
      this.legendsAndBaseLayer();
    }

    if ((currentLegendSets || baselayerLegend) && this.map) {
      this.legendsAndBaseLayer();
    }
  }

  ngAfterViewInit() {
    this.initializeMapContainer();
    interval(4)
      .pipe(take(1))
      .subscribe(() => {
        this.initialMapDraw(this.visualizationObject);
        this.legendsAndBaseLayer();
      });
  }

  zoomIn(event) {
    this.map.zoomIn();
  }

  zoomOut(event) {
    this.map.zoomOut();
  }

  recenterMap(event) {
    this.map.fitBounds(this.layersBounds);
  }

  toggleLegendContainerView() {
    this.store.dispatch(
      new fromStore.ToggleOpenVisualizationLegend(
        this.visualizationObject.componentId
      )
    );
  }

  createMap() {
    const { geofeatures = {}, analytics = {}, layers = [] } =
      this.visualizationObject || {};
    const allGeofeatures = Object.keys(geofeatures).map(key => {
      return geofeatures[key];
    });
    const allDataAnalytics = Object.keys(analytics).filter(
      key =>
        (analytics[key] &&
          analytics[key].rows &&
          analytics[key].rows.length > 0) ||
        (analytics[key] && analytics[key].count)
    );
    if (![].concat.apply([], allGeofeatures).length) {
      this.mapHasGeofeatures = false;
    } else {
      this.mapHasGeofeatures = true;
    }
    if (!allDataAnalytics.length) {
      this.mapHasDataAnalytics = false;
    } else {
      this.mapHasDataAnalytics = true;
    }

    layers.map(layer => {
      if (layer.type === 'event') {
        const headers = analytics[layer.id] && analytics[layer.id].headers;
        if (_.find(headers, { name: 'latitude' })) {
          this.mapHasGeofeatures = true;
        }
        if (layer.layerOptions.serverClustering) {
          this.mapHasGeofeatures = true;
        }
      } else if (layer.type === 'facility') {
        const { dataSelections } = layer;
        const { organisationUnitGroupSet } = dataSelections;
        if (Object.keys(organisationUnitGroupSet)) {
          this.mapHasDataAnalytics = true;
        }
      } else if (layer.type === 'earthEngine') {
        this.mapHasDataAnalytics = true;
        // Boundary layer do not have data.
      } else if (layer.type === 'boundary') {
        this.mapHasDataAnalytics = true;
      }
    });
  }

  initializeMapContainer() {
    const { height = '400px', mapWidth = '100%' } =
      this.displayConfigurations || {};
    const { mapConfiguration = null, componentId = '' } =
      this.visualizationObject || {};
    const fullScreen =
      (mapConfiguration && mapConfiguration.fullScreen) ||
      height === '100vh' ||
      height === '100%';
    const container = fromUtils.prepareMapContainer(
      componentId,
      height,
      mapWidth,
      false
    );
    const otherOptions = {
      zoomControl: false,
      maxZoom: 18,
      fadeAnimation: false,
      scrollWheelZoom: fullScreen ? true : false,
      worldCopyJump: true
    };
    const mymap = L.map(container, otherOptions);
    L.control
      .scale({ position: 'bottomleft', metric: true, updateWhenIdle: true })
      .addTo(mymap);
    this.map = mymap;
    if (fullScreen) {
      this.store.dispatch(
        new fromStore.FullScreenOpenVisualizationLegend(componentId)
      );
    }
  }

  initialMapDraw(visualizationObject: VisualizationObject) {
    const { mapConfiguration } = visualizationObject;
    const {
      overlayLayers,
      layersBounds,
      legendSets
    } = this.prepareLegendAndLayers(visualizationObject);
    this.drawBaseAndOverLayLayers(
      mapConfiguration,
      overlayLayers,
      layersBounds
    );
    if (Object.keys(legendSets).length) {
      this._currentLegendSets = legendSets;
      this.store.dispatch(
        new fromStore.AddLegendSet({
          [this.visualizationObject.componentId]: legendSets
        })
      );
    }
  }

  layerFitBound(bounds: L.LatLngBoundsExpression) {
    this.map.fitBounds(bounds);
  }

  createPane(labels, id, index, areaRadius) {
    const zIndex = 600 - index * 10;
    this.map.createPane(id);
    this.map.getPane(id).style.zIndex = zIndex.toString();

    if (labels) {
      const paneLabelId = `${id}-labels`;
      const labelPane = this.map.createPane(paneLabelId);
      this.map.getPane(paneLabelId).style.zIndex = (zIndex + 1).toString();
    }
    if (areaRadius) {
      const areaID = `${id}-area`;
      const areaPane = this.map.createPane(areaID);
      this.map.getPane(areaID).style.zIndex = (zIndex - 1).toString();
    }
  }

  initializeMapConfiguration(mapConfiguration: MapConfiguration) {
    const { latitude, longitude, zoom } = mapConfiguration;
    let center: L.LatLngExpression = [
      Number(fromLib._convertLatitudeLongitude(latitude)),
      Number(fromLib._convertLatitudeLongitude(longitude))
    ];
    if (!latitude && !longitude) {
      center = [6.489, 21.885];
    }
    const _zoom = zoom || 6;

    this.map.setView(center, _zoom, { reset: true });
  }

  createLayer(optionsLayer, index) {
    if (optionsLayer) {
      const {
        displaySettings,
        id,
        geoJsonLayer,
        visible,
        type,
        areaRadius
      } = optionsLayer;
      this.createPane(displaySettings.labels, id, index, areaRadius);
      this.setLayerVisibility(visible, geoJsonLayer);
    }
  }

  setLayerVisibility(isVisible, layer) {
    if (isVisible && this.map.hasLayer(layer) === false) {
      this.map.addLayer(layer);
    } else if (!isVisible && this.map.hasLayer(layer) === true) {
      this.map.removeLayer(layer);
    }
  }

  createBaseLayer(basemap?: string) {
    const mapTileLayer = getTileLayer(basemap);
    const baseMapLayer = fromLib.LayerType[mapTileLayer.type](mapTileLayer);
    return baseMapLayer;
  }

  drawBaseAndOverLayLayers(mapConfiguration, overlayLayers, layersBounds) {
    this.initializeMapConfiguration(mapConfiguration);

    this.basemap = this.createBaseLayer(mapConfiguration.basemap);

    const name = mapConfiguration.basemap || 'osmLight';
    const opacity = 1;
    const changedBaseLayer = false;
    const hidden = false;
    const { componentId } = this.visualizationObject;
    const payload = {
      [componentId]: { name, opacity, changedBaseLayer, hidden }
    };
    this._baseLayerLegend = { name, opacity, changedBaseLayer, hidden };
    this.store.dispatch(new fromStore.AddBaseLayer(payload));

    overlayLayers.map((layer, index) => {
      this.createLayer(layer, index);
    });

    if (layersBounds.length) {
      this.layersBounds = layersBounds;
      this.layerFitBound(layersBounds);
    }
  }

  prepareLegendAndLayers(visualizationObject: VisualizationObject) {
    const overlayLayers = fromLib.GetOverLayLayers(visualizationObject);
    const layersBounds = [];
    let legendSets = {};
    overlayLayers.map((layer, index) => {
      if (layer) {
        const { bounds, legendSet, geoJsonLayer, id } = layer;
        if (bounds) {
          layersBounds.push(bounds);
        }
        if (legendSet && legendSet.legend) {
          const legendEntity = { [id]: legendSet };
          legendSets = { ...legendSets, ...legendEntity };
        }
        const layermap = { [id]: geoJsonLayer };
        this.leafletLayers = { ...this.leafletLayers, ...layermap };
      }
    });

    return {
      overlayLayers,
      layersBounds,
      legendSets
    };
  }

  legendsAndBaseLayer() {
    if (this._baseLayerLegend) {
      const { name, opacity, changedBaseLayer, hidden } = this._baseLayerLegend;
      if (changedBaseLayer) {
        const baseMapLayer = this.createBaseLayer(name);
        this.setLayerVisibility(false, this.basemap);
        this.basemap = baseMapLayer;
      }
      const visible = !hidden;
      this.setLayerVisibility(visible, this.basemap);
      this.basemap.setOpacity(opacity);
    }
    if (
      this._currentLegendSets &&
      Object.keys(this._currentLegendSets).length
    ) {
      Object.keys(this._currentLegendSets).map(key => {
        const legendSet = this._currentLegendSets[key];
        const { opacity, layer, hidden, legend, cluster } = legendSet;
        const tileLayer =
          legend.type === 'external' ||
          cluster ||
          legend.type === 'earthEngine';
        const leafletlayer = this.leafletLayers[layer];
        // Check if there is that layer otherwise errors when resizing;
        if (leafletlayer && !tileLayer) {
          leafletlayer.setStyle({
            opacity,
            fillOpacity: opacity
          });
        }
        if (tileLayer) {
          leafletlayer.setOpacity(opacity);
        }
        const visible = !hidden;
        if (leafletlayer) {
          this.setLayerVisibility(visible, leafletlayer);
        }
      });
    }
  }

  redrawMapOndataChange(visualizationObject: VisualizationObject) {
    const { itemHeight, mapWidth } = this.displayConfigurations;
    Object.keys(this.leafletLayers).map(key =>
      this.map.removeLayer(this.leafletLayers[key])
    );
    const { mapConfiguration } = visualizationObject;
    const {
      overlayLayers,
      layersBounds,
      legendSets
    } = this.prepareLegendAndLayers(visualizationObject);
    overlayLayers.map((layer, index) => {
      this.createLayer(layer, index);
    });

    const fullScreen =
      (mapConfiguration && mapConfiguration.fullScreen) ||
      itemHeight === '100vh' ||
      itemHeight === '100%';

    if (fullScreen) {
      this.store.dispatch(
        new fromStore.FullScreenOpenVisualizationLegend(
          visualizationObject.componentId
        )
      );
    }

    if (Object.keys(legendSets).length) {
      this._currentLegendSets = legendSets;
      this.store.dispatch(
        new fromStore.AddLegendSet({
          [visualizationObject.componentId]: legendSets
        })
      );
    }

    if (layersBounds.length) {
      this.layersBounds = layersBounds;
      this.layerFitBound(layersBounds);
    }
  }
}
