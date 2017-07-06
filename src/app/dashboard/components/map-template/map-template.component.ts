import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';
import 'leaflet';
import 'leaflet.markercluster';
import {MapVisualizationService} from '../../providers/map-visualization.service';
import {TileLayers} from '../../constants/tile-layers';
declare var L;
import * as _ from 'lodash';

@Component({
  selector: 'app-map-template',
  templateUrl: './map-template.component.html',
  styleUrls: ['./map-template.component.css']
})
export class MapTemplateComponent implements OnInit {
  @Input() visualizationObject: Visualization;
  loading: boolean = true;
  hasError: boolean = false;
  errorMessage: string;
  legendIsOpen: boolean = false;
  mapHeight: any = '340px';
  mapWidth: any = '100%';
  map: any = {};
  centeringLayer: any;
  mapLegend: any;
  legendMarginRight = '25px';
  legendMarginLeft = '200px';
  subtitle: string = "";
  pinned: boolean = false;
  operatingLayers: Array<any> = [];
  isFullScreen: boolean = false;
  hideTable: boolean = true;
  mapTable: any = {headers: [], rows: []};

  constructor(private mapVisualizationService: MapVisualizationService,
              private tileLayers: TileLayers) {
  }

  ngOnInit() {
    if (this.visualizationObject.details.loaded) {
      if (!this.visualizationObject.details.hasError) {
        setTimeout(() => {
          this.visualizationObject = this.getSubtitle(this.visualizationObject);
          this.drawMap(this.visualizationObject);
        }, 10);
        this.hasError = false;
      } else {
        this.hasError = true;
        this.loading = false;
        this.errorMessage = this.visualizationObject.details.errorMessage;
      }
    }
  }


  drawMap(visualizationObject: Visualization, prioritizeFilter?: boolean) {
    const mapObject = this.mapVisualizationService.drawMap(L, visualizationObject, prioritizeFilter);
    this.prepareMapContainer(mapObject.id, this.mapHeight, this.mapWidth, this.isFullScreen);
    this.map = L.map(mapObject.id, mapObject.options);
    this.centeringLayer = mapObject.centeringLayer;
    this.mapLegend = mapObject.mapLegend;
    this.operatingLayers = mapObject.operatingLayers;

    L.control.zoom({position: "topright"}).addTo(this.map);
    L.control.scale({position: "bottomleft", metric: true, updateWhenIdle: true}).addTo(this.map);
    this.updateOnLayerLoad(mapObject);
  }

  recenterMap(map, layer) {

    if (layer instanceof L.LayerGroup) {
      if (layer.getLayers().length == 2) {
        layer = layer.getLayers()[0];
      }
    }


    let bounds = Array.isArray(layer) ? new L.LatLngBounds(layer) : layer.getBounds();
    if (this._checkIfValidCoordinate(bounds)) {
      map.fitBounds(bounds);
    } else {
      this.hasError = true;
      this.errorMessage = "Invalid organisation unit boundaries found!";
    }

  }

  updateOnLayerLoad(mapObject) {
    if (Array.isArray(this.centeringLayer)) {
      this.loading = false;
      setTimeout(() => {
        this.map.invalidateSize({pan: true});
        this.recenterMap(this.map, mapObject.centeringLayer);
      }, 10);
    } else {
      if (this.map.hasLayer(this.centeringLayer)) {
        this.loading = false;
        setTimeout(() => {
          this.map.invalidateSize({pan: true});
          this.recenterMap(this.map, mapObject.centeringLayer);
        }, 10);

      }
    }

  }

  getSubtitle(visualizationObject) {
    let layers = visualizationObject.layers;
    layers.forEach(layer => {
      if (layer.settings.subtitle) {
        visualizationObject['subtitle'] = layer.settings.subtitle;
      }
    })
    return visualizationObject;
  }

  private _checkIfValidCoordinate(bounds) {

    let boundLength = Object.getOwnPropertyNames(bounds).length;
    if (boundLength > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  prepareMapContainer(mapObjectId, height, width, isFullscreen) {
    let parentElement = document.getElementById('map-view-port-' + mapObjectId);
    let mapContainer = document.getElementById(mapObjectId);

    if (mapContainer) {
      mapContainer.parentNode.removeChild(mapContainer);
    }
    let div = document.createElement("div");
    div.setAttribute("id", mapObjectId);
    if (isFullscreen) {
      width = '100%';
      height = '81vh';
    }
    div.style.width = width;
    div.style.height = height;
    if (parentElement) {
      parentElement.appendChild(div);
    }
  }

  resizeMap(dimension, dimensionType) {
    let container = document.getElementById(this.visualizationObject.id);
    container.style.width = '0%';
    container.style.width = "0%";
    this.mapWidth = '0%';

    if (dimension && dimensionType) {
      if (dimensionType == "fullscreen") {
        container.style.height = '81vh';
        container.style.width = "100%";
        this.mapWidth = "100%";
        this.isFullScreen = true;
        this.map.scrollWheelZoom.enable();
      } else {
        container.style.height = '340px';
        container.style.width = "100%";
        this.mapWidth = "100%";
        this.map.scrollWheelZoom.disable();
      }

    } else {
      container.style.height = '340px';
      container.style.width = "100%";
      this.mapWidth = "100%";
      this.map.scrollWheelZoom.disable();
    }

    setTimeout(() => {
      this.map.invalidateSize({pan: true});
      this.recenterMap(this.map, this.centeringLayer);
    }, 800);
  }

  toggleLegendContainerView() {
    if (this.pinned) {
      this.legendIsOpen = this.pinned;
    } else {
      this.legendIsOpen = !this.legendIsOpen;
    }

  }

  changeMapTileLayer(event) {
    if (event.active) {
      this.visualizationObject.details.mapConfiguration.basemap = event.name;
    } else {
      this.visualizationObject.details.mapConfiguration.basemap = null;
    }
    this.drawMap(this.visualizationObject);


  }

  updateMapLayers(event) {
    let layerActedUpon: any = null;
    this.operatingLayers.forEach(layer => {

      if (layer.hasOwnProperty(event.layer.name) || layer.hasOwnProperty(event.layer.id)) {
        layerActedUpon = layer[event.layer.name] ? layer[event.layer.name] : layer[event.layer.id];
      }

    })

    if (event.layer.hasOwnProperty('url')) {
      layerActedUpon = this.mapVisualizationService.prepareTileLayer(L, this.tileLayers.getTileLayer(event.layer.name));
    }


    if (layerActedUpon) {

      if (event.action == "HIDE") {
        layerActedUpon.removeFrom(this.map);
        this.map.removeLayer(layerActedUpon);
      }

      if (event.action == "SHOW") {
        this.map.addLayer(layerActedUpon);
      }

    }

  }

  stickyMapLegend(event) {
    this.pinned = event;
  }

  downloadMapAsFiles(event) {
    let fileFormat = event.format;
    let data = event.data;
    if (fileFormat == "image") {
      data = this.map.getContainer();
    }
    this.mapVisualizationService.downLoadMapAsFiles(fileFormat, data);
  }

  closeMapLegend() {
    this.legendIsOpen = false;
    this.pinned = false;
  }

  dragAndDropHandler(event) {
    let newVisualizationObject = this.visualizationObject;
    let layers = newVisualizationObject.layers;
    newVisualizationObject.layers = this.sortLayers(layers, event);
    this.drawMap(this.visualizationObject);
  }

  clickedOutSideLegend(event) {
  }

  sortLayers(layers, eventLayers) {
    let newLayers = [];
    let testlayers = [];

    eventLayers.forEach((event, eventIndex) => {
      layers.forEach((layer, layerIndex) => {
        if (event.id == layer.settings.id) {
          newLayers[eventIndex] = layer;
          testlayers.push(layer.settings.name)
        }
      })
    })
    console.log(testlayers);
    return newLayers;
  }

  drawMapDataTable(event) {
    this.hideTable = false;
    this.mapTable.headers = this.prepareTableHeaders(event.layers);
    this.mapTable.rows = this.prepareTableRows(event.layers);
  }

  hideDataTable() {
    this.hideTable = true;
  }

  prepareTableHeaders(layers) {

    let headers = ['Organisation Unit'];
    layers.forEach(layer=> {
      if (layer.analytics && layer.analytics.hasOwnProperty('headers')) {
        headers.push(layer.settings.name);
      }
    })
    return headers;


  }

  prepareTableRows(layers) {

    let rowArray = [];
    layers.forEach(layer=> {
      let rows = [];
      if (layer.analytics && layer.analytics.hasOwnProperty('headers')) {
        let headers = layer.analytics.headers;
        let names = layer.analytics.names;
        let indexOU = _.findIndex(layer.analytics.headers, ['name', 'ou']);
        let indexVal = _.findIndex(layer.analytics.headers, ['name', 'value']);

        layer.analytics.rows.forEach(row=> {
          console.log(names[row[indexOU]])
        })
      }
    })
    return rowArray;
  }
}
