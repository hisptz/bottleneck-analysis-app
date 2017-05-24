import {Component, OnInit, Input, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {Visualization} from "../../model/visualization";
import {MapService} from "../../services/map.service";
import 'leaflet';
import "file-saver";
import FeatureCollection  = GeoJSON.FeatureCollection
import StyleFunction = L.StyleFunction;
import Feature = GeoJSON.Feature;
import GeometryObject = GeoJSON.GeometryObject;
import GeoJSONEvent = L.GeoJSONEvent;
import {Constants} from "../../services/constants";
import {Observable} from "rxjs";
import {Http, Response} from "@angular/http";
import {forEach} from "@angular/router/src/utils/collection";
import {timeInterval} from "rxjs/operator/timeInterval";

declare var L;
declare var $;
declare var window;
declare var document;
declare var localStorage;
declare var domtoimage;

export class Container {
  fullWidthLeft: string = "col-md-12 col-xs-12  col-lg-12";
  fullWidthRight: string = "";

  halfWidthLeft: string = "col-md-9 col-xs-9  col-lg-9";
  halfWidthRight: string = "col-md-3 col-xs-3 col-lg-3";
}

export class Map {
  id: any = "";
  name: any = "";
  basemap: any = "";
  baseMaps: Object;
  baseMapArray: Array<any>;
  height: any = "";
  mapContainer?: any = "mapContainer";
  center: Object = {latitude: 0, longitude: 0, zoom: 0};
  layers: Object = {primaryLayers: [], secondaryLayers: []};

}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapComponent implements OnInit {

  @Input() mapData: Visualization;
  @Input() customFilters: any[];
  loading: boolean = true;
  hasError: boolean = false;
  errorMessage: string;


  public map: Map;
  public container = new Container();
  public mapInterface: any;
  public layerController: String = "visible";
  public mapVisibilityState: String = "hidden";
  public showButtonLegend: boolean = false;
  public legendIsSticky: boolean = false;
  public mapLegend: Array<any> = [];
  public legendHovered: boolean = false;
  public showLayerSettings: boolean = false;
  public baseMaps: Array<any> = [];
  public dataLayers: Array<any> = [];
  public isTrancated: boolean = true;
  public isDownloading: boolean = false;
  public showLegendContainer: boolean = false;
  public isLegendShown: boolean = true;
  public leftMapContainer: string = "";
  public rightMapContainer: string = "";
  public showLeftContainer: boolean = true;
  public baseLayers: Array<any> = [];
  public layersOpacity: Array<any> = [];
  public mapLayers = {primaryLayers: [], secondaryLayers: []};
  public oldMapLayers: any;
  public mapObject: any;
  public favouriteObject: any;
  public mapHeight: string = '340px';
  public mapWidth: string = '100%';
  public mapIsFullScreen = false;

  constructor(private mapService: MapService, private constant: Constants, private http: Http) {

  }

  ngOnInit() {
    this.loading = true;
    if (this.mapData != undefined) {
      setTimeout(() => {
        this.drawMap(this.mapData);
      }, 10)
      this.loading = false;
    }
  }


  resizeMap(dimension, dimensionType) {
    this.mapHeight = '0px';
    this.mapWidth = "0%";

    if (dimension && dimensionType) {
      if (dimensionType == "fullScreen") {
        this.mapHeight = '650px';
        this.mapWidth = "100%";
        this.mapIsFullScreen = true;
      } else {
        this.mapHeight = '340px';
        this.mapWidth = "100%";
      }

    } else {
      this.mapHeight = '340px';
      this.mapWidth = "100%";
    }

    setTimeout(() => {
      this.mapInterface.invalidateSize({pan: true});
    }, 200);
  }

  /**
   * Draw map on the html template
   * @param mapObject
   */
  drawMap(favouriteObject) {

    /**
     * Configure map object for display in the template
     * @type {L.Map}
     */
    this.mapObject = this.prepareMapObjectConfiguration(favouriteObject);
    this.favouriteObject = favouriteObject;
    this.map = this.mapObject;
    this.baseMaps = this.prepareBaseMapsForSettingsControl(this.mapObject.baseMapArray, this.mapObject.baseMaps);
    this.prepareMapLayers(favouriteObject, this.mapObject.baseMaps);
    this.dataLayers = this.prepareDataLayers(this.mapLayers.secondaryLayers, this.mapObject.baseMaps);
    this.renderMap(false);
  }

  renderMap(iSreRendering) {
    this.map.layers = this.mapLayers;
    this.baseLayers = [];
    if (this.mapLayers.primaryLayers) {
      this.mapLayers.primaryLayers.forEach((primaryLayer, primaryLayerIndex) => {
        if (primaryLayer.type == "basemap") {
          this.baseLayers.push(primaryLayer.layer);
        }

        if (primaryLayer.type == "thematic") {
          this.baseLayers.push(primaryLayer.layer);

        }

        if (primaryLayer.type == "event") {
          if (primaryLayer.layer.type == "cruster") {
            this.baseLayers.push(primaryLayer.layer.layer);
          } else {
          }
        }


        if (primaryLayer.type == "facility") {
          primaryLayer.layer.forEach((layer, layerIndex) => {
          });
        }


        if (primaryLayer.type == "external") {
          this.baseLayers.push(primaryLayer.layer[Object.getOwnPropertyNames(primaryLayer.layer)[0]]);
        }

        if (primaryLayer.type == "boundary") {
          this.baseLayers.push(primaryLayer.layer);
        }

      });
    }

    /**
     * It's a fresh new map
     */

    if (iSreRendering || this.mapInterface) {
      this.mapInterface.remove();
    }

    this.mapInterface = L.map(this.prepareMapContainer(this.mapObject.mapContainer), {
      center: L.latLng(this.mapObject.center.latitude, this.mapObject.center.longitude),
      zoom: this.mapObject.center.zoom - 1,
      zoomControl: true,
      scrollWheelZoom: false,
      layers: []
    });

    this.baseLayers.forEach(baseLayer => {
      baseLayer.addTo(this.mapInterface);
    });


    this.modifyMapInterface(this.mapLayers, this.mapObject);
    this.mapVisibilityState = "visible";

    L.control.zoom({position: "topright"}).addTo(this.mapInterface);

  }


  updateOpacity(layerId, event) {
    let opacityValue = +(event.target.value) / 100;

    this.updateMapConfigurationsForSingleLayer('opacity', opacityValue, layerId);

  }

  toggleLayerView(layerId) {
    let visibility = "show";
    this.mapLegend.forEach(legend => {
      if (legend.layerId == layerId) {
        visibility = legend.hidden ? "show" : "hide";
        legend.hidden = !legend.hidden;

      }
    })

    this.updateMapConfigurationsForSingleLayer('visibility', visibility, layerId);
  }


  updateMapConfigurationsForSingleLayer(updatedParameter, layerNewSettings, layerId) {
    /**
     * Primary layers are default layers while secondary layers present for switching
     */
    let availableLayers = this.sortLayers(this.favouriteObject.layers);
    if (updatedParameter == "opacity") {
      let newAvailableLayers = [];
      availableLayers.forEach(layer => {
        if (layer.settings.id == layerId) {
          layer.settings.opacity = +(layerNewSettings);
        }
        newAvailableLayers.push(layer);

      })
      availableLayers = newAvailableLayers;
    }

    if (updatedParameter == "visibility") {
      let newAvailableLayers = [];
      if (layerNewSettings == "hide") {
        availableLayers.forEach(layer => {
          if (layer.settings.id == layerId) {

          } else {
            newAvailableLayers.push(layer);
          }

        })
        availableLayers = newAvailableLayers;
      }
    }

    let mapLayers = this.mapLayers;
    this.oldMapLayers = mapLayers;
    this.prepareLayersForDisplayFromListOfAvailableLayers(this.mapObject, this.mapObject.baseMaps, availableLayers);
    this.renderMap(true);

  }

  modifyMapInterface(mapLayers, mapObject) {
    let secondaryLayerCopy = {};

    if (mapLayers.secondaryLayers) {
      mapLayers.secondaryLayers.forEach((secondaryLayer, secondaryLayerIndex) => {
        if (secondaryLayer.type == "basemap") {
          secondaryLayerCopy[Object.getOwnPropertyNames(secondaryLayer.layer)[0]] = secondaryLayer.layer[Object.getOwnPropertyNames(secondaryLayer.layer)[0]]
        }

        if (secondaryLayer.type == "thematic") {
          secondaryLayerCopy[Object.getOwnPropertyNames(secondaryLayer)[0]] = secondaryLayer[Object.getOwnPropertyNames(secondaryLayer)[0]];
        }

        if (secondaryLayer.type == "event") {
          let eventLayer = secondaryLayer.layer[Object.getOwnPropertyNames(secondaryLayer.layer)[0]];
          if (!Array.isArray(eventLayer)) {
            secondaryLayerCopy[Object.getOwnPropertyNames(secondaryLayer.layer)[0]] = eventLayer;
          } else {
            eventLayer.forEach(marker => {
              marker.addTo(this.mapInterface);
            })
          }

        }


        if (secondaryLayer.type == "facility") {
          let layerName = Object.getOwnPropertyNames(secondaryLayer.layer) ? Object.getOwnPropertyNames(secondaryLayer.layer)[0] : null;

          if (layerName) {
            secondaryLayerCopy[layerName] = secondaryLayer.layer[layerName];
            let markers = secondaryLayer.layer[layerName];
            if (markers) {
              markers.forEach((marker) => {
                let theMarker = L.marker(marker.latLang, {
                  icon: marker.icon
                })
                theMarker.on('mouseover', (event) => {
                  theMarker.bindTooltip(marker.content, {
                    direction: 'auto',
                    permanent: false,
                    sticky: true,
                    interactive: true,
                    opacity: 1
                  })
                });

                theMarker.on('mouseout', (event) => {
                  theMarker.closeTooltip()
                })
                theMarker.bindPopup(marker.content);
                theMarker.addTo(this.mapInterface);
              })
            }
          }

        }


        if (secondaryLayer.type == "external") {
          secondaryLayerCopy[Object.getOwnPropertyNames(secondaryLayer.layer)[0]] = secondaryLayer.layer[Object.getOwnPropertyNames(secondaryLayer.layer)[0]]

        }
        if (secondaryLayer.type == "boundary") {
          secondaryLayerCopy[Object.getOwnPropertyNames(secondaryLayer.layer)[0]] = secondaryLayer.layer[Object.getOwnPropertyNames(secondaryLayer.layer)[0]]

        }

        if (secondaryLayer.showLabel) {

          secondaryLayer.labels.forEach(label => {
            label.addTo(this.mapInterface);
          })
        }

      });
    }

    this.recenterMap();
  }

  containerArrangement() {
    if (this.mapLegend.length < 0) {
      this.leftMapContainer = this.container.fullWidthLeft;
      this.rightMapContainer = "";
      this.showLeftContainer = false;
    } else {
      this.leftMapContainer = this.container.halfWidthLeft;
      this.rightMapContainer = this.container.halfWidthRight;
      this.showLeftContainer = true;
    }

    this.mapLegend.forEach((legend, index) => {
      if (index == 0) {
        legend.collapse = "in";
      }
    })

  }

  toggleLegendView(i) {

    if (this.mapLegend.length > 1) {
      this.mapLegend.forEach((legend, index) => {
        if (index != i) {
          legend.collapse = "";
        }

      })
    }

    if (this.mapLegend[i].collapse == "in") {
      this.mapLegend[i].collapse = "";
    } else {
      this.mapLegend[i].collapse = "in";
    }
  }

  toggleLegendContainerView() {
    if (this.legendIsSticky) {
      this.showLegendContainer = this.legendIsSticky;
    } else {
      this.showLegendContainer = !this.showLegendContainer;
    }

  }

  /**
   *
   * @param baseMapArray
   * @returns {Array}
   */
  prepareBaseMapsForSettingsControl(baseMapArray, defaultBaseLayer): Array<any> {

    let baseMaps: Array<any> = [];
    if (baseMapArray) {
      let state = false;
      baseMapArray.forEach(basemap => {
        state = defaultBaseLayer[Object.getOwnPropertyNames(basemap)[0]] ? true : false;
        baseMaps.push({
          name: Object.getOwnPropertyNames(basemap)[0],
          active: state,
          base: basemap[Object.getOwnPropertyNames(basemap)[0]]
        });
      })
    }
    return baseMaps;
  }

  formatStringLength(mapTitle) {
    let maximumLength = 51;
    if (mapTitle && mapTitle.length > maximumLength) {
      mapTitle = mapTitle.substr(0, maximumLength) + "..."
    }
    return mapTitle
  }

  trancateTitle() {
    this.isTrancated = true;
  }

  showFullTitle() {
    this.isTrancated = false;
  }

  recenterMap() {
    this.dataLayers.forEach(dataLayer => {
      if (dataLayer.type != "external" && dataLayer.type != "facility" && dataLayer.type != "event") {
        this.mapInterface.fitBounds(dataLayer.data.getBounds());
        return false;
      }

    })

  }


  /**
   *
   * @param baseMapArray
   * @returns {Array}
   */
  prepareDataLayers(secondaryLayers, defaultBaseLayer): Array<any> {
    let baseMaps: Array<any> = [];

    if (secondaryLayers) {
      let state = false;
      secondaryLayers.forEach(basemap => {
        if (basemap.name && basemap.name != "") {
          state = defaultBaseLayer[basemap.name] ? true : false;
          baseMaps.push({
            type: basemap.type,
            active: state,
            name: basemap.name,
            data: basemap.layer[basemap.name]
          });
        }

      })
    }
    return baseMaps;
  }


  /**
   * Prepare map configuration compatible with leaflet map object
   * @param itemData
   * @returns {Map}
   */
  prepareMapObjectConfiguration(itemData): Map {
    let mapObject: Map;
    let baseMaps = {};
    let defaultBaseMap = {
      'OSM Light': L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy;<a href="https://carto.com/attribution">cartoDB</a>'
      })
    }

    let openStreetMap = {
      'OSM Light': L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy;<a href="https://carto.com/attribution">cartoDB</a>'
      })
    }

    // let googleSheetsBaseMap = {
    //   'Google Streets': L.gridLayer.googleMutant({
    //     type: 'roadmap'
    //   })
    // }
    //
    // let googleHybrid = {
    //   'Google Hybrid': L.gridLayer.googleMutant({
    //     type: 'hybrid'
    //   })
    // }
    //
    // let googleSatellite = {
    //   'Google Hybrid': L.gridLayer.googleMutant({
    //     type: 'satellite'
    //   })
    // }
    //
    // let googleTerrain = {
    //   'Google Hybrid': L.gridLayer.googleMutant({
    //     type: 'terrain'
    //   })
    // }
    //

    if (!itemData.details.mapConfiguration.basemap || itemData.details.mapConfiguration.basemap == "osmLight") {
      baseMaps = defaultBaseMap;
    } else if (itemData.details.mapConfiguration.basemap == "googleStreets") {
      // baseMaps = googleSheetsBaseMap;
    } else if (itemData.details.mapConfiguration.basemap == "googleHybrid") {
      // baseMaps = googleHybrid;
    }


    /**
     * Get map layers from itemData Object and  basemaps
     * @type {{primaryLayers: Array; secondaryLayers: Array}}
     */
    mapObject = {
      id: itemData.id,
      name: itemData.details.mapConfiguration.name,
      basemap: itemData.details.mapConfiguration.basemap,
      baseMaps: baseMaps,
      // baseMapArray: [openStreetMap, googleTerrain, googleSheetsBaseMap, googleHybrid],
      baseMapArray: [openStreetMap],
      mapContainer: itemData.id,
      height: itemData.details.itemHeight,
      center: {
        latitude: itemData.details.mapConfiguration.latitude,
        longitude: itemData.details.mapConfiguration.longitude,
        zoom: itemData.details.mapConfiguration.zoom
      },
      layers: null
    }


    return mapObject;
  }

  /**
   * Prepare container for holding maps
   * @param mapContainer
   * @returns {any}
   */
  prepareMapContainer(mapContainer) {
    return mapContainer;
  }

  /**
   * Prepare map layers
   * @param mapObject
   * @param baseMaps
   * @returns {{primaryLayers: Array, secondaryLayers: Array}}
   */
  prepareMapLayers(mapObject, baseMaps) {

    /**
     * Primary layers are default layers while secondary layers present for switching
     */
    let availableLayers = this.sortLayers(mapObject.layers);

    this.prepareLayersForDisplayFromListOfAvailableLayers(mapObject, baseMaps, availableLayers);
  }

  prepareLayersForDisplayFromListOfAvailableLayers(mapObject, baseMaps, availableLayers) {
    this.mapLayers.primaryLayers = [];
    this.mapLayers.secondaryLayers = [];
    if (Object.getOwnPropertyNames(baseMaps).length > 0) {

      this.mapLayers.primaryLayers.push({type: "basemap", layer: baseMaps[Object.getOwnPropertyNames(baseMaps)[0]]});
    }


    let totalLayers = availableLayers.length;
    let layersInOrder = [];

    availableLayers.forEach(availableLayer => {
      layersInOrder.push(availableLayer.settings.name);

      //TODO find best way to handle visualization with no layers
      if(!availableLayer.settings.hasOwnProperty('layer')) {
        availableLayer.settings.layer = 'thematic';
      }

      if (availableLayer.settings.layer == "external") {
        let layerSetting = availableLayer.settings;

        let secondaryLayer = {};
        let external = this.prepareExternalLayer(layerSetting);

        if (external) {
          secondaryLayer[external.name] = external.layer;
          this.mapLayers.primaryLayers.push({type: "external", name: external.name, layer: external.layer});
          this.mapLayers.secondaryLayers.push({type: "external", name: external.name, layer: secondaryLayer});
        }
      }

      if (availableLayer.settings.layer == "earthEngine") {
        let layerSetting = availableLayer.settings;

        let secondaryLayer = {};
        let earthEngine = this.prepareEarthEngineLayer(layerSetting);

        if (earthEngine) {
          secondaryLayer[earthEngine.name] = earthEngine.layer;
          this.mapLayers.primaryLayers.push({type: "earthEngine", name: earthEngine.name, layer: earthEngine.layer});
          this.mapLayers.secondaryLayers.push({type: "earthEngine", name: earthEngine.name, layer: secondaryLayer});
        }
      }


      if (availableLayer.settings.layer == "boundary") {
        /**
         * Handle Boundary Layers
         */

        let layerSetting = availableLayer.settings;
        let layerAnalytics = availableLayer.analytics;
        let secondaryLayer = {};

        let boundaryLayer = this.prepareBoundaryLayer(layerSetting, layerAnalytics);
        secondaryLayer[boundaryLayer.name] = boundaryLayer.layer;
        this.mapLayers.primaryLayers.push({type: "boundary", name: boundaryLayer.name, layer: boundaryLayer.layer});
        this.mapLayers.secondaryLayers[totalLayers - 1] = {
          type: "boundary",
          name: boundaryLayer.name,
          layer: secondaryLayer
        };

        this.showButtonLegend = false;

      }


      if (availableLayer.settings.layer.indexOf('thematic') >= 0) {
        /**
         * Handle Thematic Layers
         */
        let layerSetting = availableLayer.settings;
        let layerAnalytics = availableLayer.analytics;
        let secondaryLayer = {};

        let thematicLayer = this.prepareThematicsLayer(layerSetting, layerAnalytics);
        secondaryLayer[thematicLayer.name] = thematicLayer.layer;
        this.mapLayers.primaryLayers.push({type: "thematic", name: thematicLayer.name, layer: thematicLayer.layer});
        this.mapLayers.secondaryLayers.push({
          type: "thematic",
          name: thematicLayer.name,
          layer: secondaryLayer,
          showLabel: thematicLayer.showLabel,
          labels: thematicLayer.labels
        });
        this.showButtonLegend = true;
      }


      if (availableLayer.settings.layer == "event") {
        /**
         * Handle Event Layers
         */
        this.layersOpacity.push(availableLayer.settings.opacity);
        let layerSetting = availableLayer.settings;
        let layerAnalytics = availableLayer.analytics;
        let secondaryLayer = {};

        let eventLayer = this.prepareEventLayer(layerSetting, layerAnalytics);
        secondaryLayer[this.map.name] = eventLayer.layer;
        this.mapLayers.primaryLayers.push({type: "event", name: this.map.name, layer: eventLayer});
        this.mapLayers.secondaryLayers.push({type: "event", name: this.map.name, layer: secondaryLayer});

        /**
         * This code when commented legend will disappear
         */

      }


      if (availableLayer.settings.layer == "facility") {
        /**
         * Handle Facility Layers
         */

        let layerSetting = availableLayer.settings;
        let layerAnalytics = availableLayer.analytics;
        let secondaryLayer = {};


        let facilityLayer = this.prepareFacilityLayer(layerSetting, layerAnalytics);
        secondaryLayer[facilityLayer.name] = facilityLayer.layer;
        this.mapLayers.primaryLayers.push({type: "facility", name: facilityLayer.name, layer: facilityLayer.layer});
        this.mapLayers.secondaryLayers.push({type: "facility", name: facilityLayer.name, layer: secondaryLayer});

      }

    })

  }

  /**
   *
   * @param layerSetting
   * @param layerAnalytics
   * @returns {{name, layer: {}}}
   */
  prepareEventLayer(layerSetting, layerAnalytics) {

    let names = layerAnalytics.metaData.names;
    let pe = layerAnalytics.metaData.pe;
    let dx = layerAnalytics.metaData.dx;
    let ou = layerAnalytics.metaData.ou;
    let rows = layerAnalytics.rows;
    let features = this.getGeoJsonObject(layerSetting.geoFeature).features;
    let layer: any = "";
    let type = "";

    /**
     * add period attribute to layer settings
     */
    layerSetting['period'] = names[pe];

    /**
     * Give each feature in a layer it's respective value
     */
    features = this.bindDataToEventLayers(features, names, pe, dx, ou, rows);
    if (layerSetting.eventClustering) {
      type = "cruster";
      let markers = L.markerClusterGroup.layerSupport({
        iconCreateFunction: (cluster) => {
          let childMarkers = cluster.getAllChildMarkers();
          let iconSize = this.calculateClusterSize(cluster.getChildCount());
          let marginTop = this.calculateMarginTop(iconSize);


          setTimeout(() => {
            $('.' + layerSetting.id).css({'backgroundColor': '#' + layerSetting.eventPointColor});
          }, 30)

          return L.divIcon(
            {
              html: '<b style="margin-top:' + marginTop + 'px;">' + this.writeInKNumberSystem(cluster.getChildCount()) + '</b>',
              className: 'marker-cluster ' + layerSetting.id,
              iconSize: new L.Point(iconSize[0], iconSize[1])
            }
          );
        }, showCoverageOnHover: false, spiderfyOnMaxZoom: false
      });

      markers.on('clusterclick', (a) => {
        $('.' + layerSetting.id).css({'backgroundColor': '#' + layerSetting.eventPointColor});
      });

      if (rows) {
        rows.forEach(row => {
          let titleConfig = "<b>Water Point: </b>" + row[5] + "<br/>" + "<b>Coordinate:</b>" + row[4] + "," + row[3] + "<br/>" + "<b>Code:</b>" + row[6];
          let a = [row[4], row[3], titleConfig];
          let title = a[2];


          let eventPointSize = this.getCorrespondingSquareDimensions(layerSetting.eventPointRadius) * 1.8;
          var icon = L.divIcon({
            className: 'map-marker ',
            iconSize: null,
            iconAnchor: [10, 27],
            html: '<div class="icon" style="width:' + eventPointSize + 'px;height:' + eventPointSize + 'px;background-color:#' + layerSetting.eventPointColor + ';border-radius: ' + eventPointSize + 'px;border: 2px solid #E3E3E3;"></div>'
          });

          let marker = L.marker(L.latLng(a[0], a[1]), {
            title: title, icon: icon
          });
          marker.bindPopup(title);
          markers.addLayer(marker);
        })
      }

      layer = markers;
    } else {
      type = "non_cruster";
      // TODO : Look upon the event non clustering functions these codes are not well optimized
      let markersArray = [];

      if (rows) {
        rows.forEach(row => {
          let titleConfig = "<b>Water Point: </b>" + row[5] + "<br/>" + "<b>Coordinate:</b>" + row[4] + "," + row[3] + "<br/>" + "<b>Code:</b>" + row[6];
          let a = [row[4], row[3], titleConfig];
          let title = a[2];

          let eventPointSize = this.getCorrespondingSquareDimensions(layerSetting.eventPointRadius) * 1.8;
          var icon = L.divIcon({
            className: 'map-marker ',
            iconSize: null,
            iconAnchor: [10, 27],
            html: '<div class="icon" style="width:' + eventPointSize + 'px;height:' + eventPointSize + 'px;background-color:#' + layerSetting.eventPointColor + ';border-radius: ' + eventPointSize + 'px;border: 1px solid rgba(255,255,255,0.8);"></div>'
          });

          let marker = new L.marker(L.latLng(a[0], a[1]), {
            icon: icon
          });
          marker.bindPopup(title);
          markersArray.push(marker);
        })
      }
      layer = markersArray;
    }


    return {name: layerSetting.name, layer: layer, type: type};
  }


  getCorrespondingSquareDimensions(eventPointRadius) {
    return +((0.5 * (+(eventPointRadius)) * 3.14159).toFixed(0))
  }

  onDrop(mapLegend) {
    let orderedAvailableLayers = [];
    mapLegend.forEach(legend => {
      this.favouriteObject.layers.forEach(layer => {

        if (layer.settings.id == legend.layerId) {
          orderedAvailableLayers.push(layer);
        }
      })
    })

    this.prepareLayersForDisplayFromListOfAvailableLayers(this.mapObject, this.mapObject.baseMaps, orderedAvailableLayers);
    this.renderMap(true);
  }


  sortLayers(layers) {

    return layers;
  }

  /**
   *
   * @param childCount
   * @returns {[any,number]}
   */
  calculateClusterSize(childCount) {
    let width, height = 40;

    if (childCount < 100) {
      width = 30, height = 30;
    }

    if (childCount < 10) {
      width = 20, height = 20;
    }

    return [width, height];
  }

  /**
   *
   * @param iconSize
   * @returns {number}
   */
  calculateMarginTop(iconSize) {
    let size = iconSize[0];
    if (size == 30) {
      return 5;
    }
    if (size == 20) {
      return 2;
    }

    return 10;
  }

  showStickyLegend() {
    this.legendHovered = true;
  }


  hideStickyLegend() {
    this.legendHovered = false;
  }

  /**
   *
   * @param layerSetting
   * @param layerAnalytics
   * @returns {{name, layer: GeoJSON}}
   * @returns {{boolean}}
   */
  prepareThematicsLayer(layerSetting, layerAnalytics) {

    let headers = layerAnalytics.headers;
    let names = layerAnalytics.metaData.names;
    let pe = layerAnalytics.metaData.pe;
    let dx = layerAnalytics.metaData.dx;
    let ou = layerAnalytics.metaData.ou;
    let rows = layerAnalytics.rows;
    let features = this.getGeoJsonObject(layerSetting.geoFeature).features;
    /**
     * add period attribute to layer settings
     */
    layerSetting['period'] = names[pe];

    /**
     * Give each feature in a layer it's respective value
     */

    features = this.bindDataToThematicLayers(features, headers, names, pe, dx, ou, rows);
    let sortedData = this.mapService.sortDataArray(features);
    let legendObject: any = this.mapService.getMapLegends(features, sortedData, layerSetting);
    let scriptLegend = legendObject.scriptLegend;
    this.updateMapLegendVessel(scriptLegend);
    let colorScale = legendObject.colorScale;
    this.containerArrangement();
    let showLabels = layerSetting.labels;
    let labels = [];

    let sanitizeColor = (color) => {
      let colors = color.split("#");
      color = "#" + colors[colors.length - 1];
      return color;
    }

    let layer = L.geoJSON(features, {
      onEachFeature: (feature, latlng) => {
        if (showLabels) {
          var center = latlng.getBounds().getCenter();
          var label = L.marker(center, {
            icon: L.divIcon({
              iconSize: null,
              className: 'label',
              html: '<div  style="color:' + sanitizeColor(layerSetting.labelFontColor) + ';font-size:' + layerSetting.labelFontSize + ';font-weight:bolder;-webkit-text-stroke: 0.055em white;">' + feature.properties.name + '</div>'
            })
          })
          labels.push(label);
        }
      },
      pointToLayer: (feature, latlng) => {
        var geojsonMarkerOptions = {
          radius: legendObject.getFeatureRadius(feature.properties.dataElement.value),
          fillColor: "#ff7800",
          color: "#000",
          weight: 0.5,
          opacity: layerSetting.opacity,
          fillOpacity: layerSetting.opacity
        };

        let circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
        return circleMarker
      }
    });
    layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
      let dataElementValue: number = (feature.properties as any).dataElement.value;
      let color: any = (dataElementValue) => {
        let colorObject: any = this.mapService.decideColor(dataElementValue, 1, scriptLegend.classes, colorScale);
        let style: any = colorObject.respectiveScoreColor;

        return style;
      }

      let featureStyle: any = {
        "color": "#3C3A38",
        "fillColor": color(dataElementValue),
        "fillOpacity": layerSetting.opacity,
        "weight": 1,
        "opacity": layerSetting.opacity,
        "stroke": typeof (dataElementValue) == "number" ? true : false
      }

      return featureStyle;
    });
    layer.on(
      {
        click: (feature, layer) => {

        },
        mouseover: (event) => {
          let hoveredFeature: Feature<GeometryObject> = event.layer.feature;
          let hoveredFeatureProperties: any = hoveredFeature.properties;

          let hov: any = hoveredFeature.properties;
          let hoveredFeatureName = hoveredFeatureProperties.name;
          let dataElementName = hoveredFeatureProperties.dataElement.name;
          let dataElementValue = hoveredFeatureProperties.dataElement.value;

          let toolTipContent: string =
            "<div style='color:#333!important;font-size: 10px'>" +
            "<table>" +
            "<tr><td style='color:#333!important;'>" + hoveredFeatureName + "</td><td style='color:#333!important;' > (" + dataElementValue + ")</td>" +
            "</tr>" +
            "</table>" +
            "</div>";

          let popUp = layer.getPopup();


          if (popUp && popUp.isOpen()) {
            layer.closeTooltip();
          } else if (hov.id == hoveredFeatureProperties.id && typeof hoveredFeatureProperties.dataElement.value == "number") {
            layer.bindTooltip(toolTipContent, {
              direction: 'auto',
              permanent: false,
              sticky: true,
              interactive: true,
              opacity: 1
            })
          } else {
            layer.closeTooltip();
          }

          layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
            let properties: any = feature.properties;
            let dataElementScore: any = properties.dataElement.value;
            let settings = eval("(" + localStorage.getItem(this.mapData.id) + ")");
            let color: any = (dataElementScore) => {

              return (feature.properties as any).legend(dataElementScore);

            }
            let featureStyle: any =
              {
                "fillOpacity": layerSetting.opacity,
                "opacity": layerSetting.opacity,
                "stroke": typeof (dataElementScore) == "number" ? true : false,
              }
            let hov: any = hoveredFeature.properties;
            if (hov.id == properties.id && typeof properties.dataElement.value == "number") {
              featureStyle.fillOpacity = layerSetting.opacity;
              featureStyle.color = "#3C3A38";
              featureStyle.weight = 4;
            }


            return featureStyle;
          });

        },
        mouseout: (event) => {
          let hoveredFeature: Feature<GeometryObject> = event.layer.feature;
          let toolTip = layer.getTooltip();
          if (toolTip) {
            layer.closeTooltip();
          }
          layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
            let properties: any = feature.properties;
            let dataElementScore: any = properties.dataElement.value;
            let settings = eval("(" + localStorage.getItem(this.mapData.id) + ")");
            let color: any = (dataElementScore) => {

              return (feature.properties as any).legend(dataElementScore);

            }
            let featureStyle: any =
              {
                "fillOpacity": layerSetting.opacity,
                "weight": 1,
                "opacity": layerSetting.opacity,
                "stroke": typeof (dataElementScore) == "number" ? true : false,
              }
            let hov: any = hoveredFeature.properties;
            if (hov.id == properties.id && typeof properties.dataElement.value == "number") {
              featureStyle.fillOpacity = layerSetting.opacity;
              featureStyle.color = "#3C3A38";
            }


            return featureStyle;
          });
        }
      }
    )

    return {name: layerSetting.name, layer: layer, showLabel: showLabels, labels: labels};

  }

  updateMapLegendVessel(scriptLegend) {

    if (this.mapLegend.length == 0) {
      this.mapLegend.push(scriptLegend);
    }
    let found = 0;
    this.mapLegend.forEach(legend => {
      if (legend.name == scriptLegend.name) {
        found++;
        return;

      }
    })

    if (found == 0) {
      this.mapLegend.push(scriptLegend);
    }
  };


  prepareEarthEngineLayer(layerSetting) {
    if (layerSetting.config) {
      let layerConfiguration = eval('(' + layerSetting.config + ')');

      if (layerConfiguration.hasOwnProperty('url')) {
        let url = layerConfiguration.url;
        let name = layerConfiguration.name;
        let attribution = layerConfiguration.attribution;

        let earthEngine = {};

        earthEngine[name] = L.tileLayer(url, {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
        })

        return {name: name, layer: earthEngine};
      }
    }

  }

  /**
   *
   * @param getChildCount
   * @returns {any}
   */
  writeInKNumberSystem(getChildCount) {
    if (getChildCount >= 1000) {
      getChildCount = (getChildCount / 1000).toFixed(1) + "k";
    }
    return getChildCount;
  }

  prepareExternalLayer(layerSetting) {

    if (layerSetting.config) {
      let layerConfiguration = eval('(' + layerSetting.config + ')');

      if (layerConfiguration.hasOwnProperty('url')) {
        let url = layerConfiguration.url;
        let name = layerConfiguration.name;
        let attribution = layerConfiguration.attribution;

        let external = {};

        external[name] = L.tileLayer(url, {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
        })

        return {name: name, layer: external};
      }
    }

  }

  /**
   *
   * @param layerSetting
   * @param layerAnalytics
   * @returns {{name, layer: string}}
   */
  prepareBoundaryLayer(layerSetting, layerAnalytics) {
    let showLabels = layerSetting.labels;
    let labels = [];
    let boundaries: any = {};
    if (layerSetting) {


      let legendObject: any = this.mapService.getMapBoundaryLegend(layerSetting);
      let scriptLegend = legendObject.scriptLegend;
      this.updateMapLegendVessel(scriptLegend);

      let features: any = layerSetting.geoFeature;
      let geoJson = this.getGeoJsonObject(features);
      let featureCollection = geoJson.features;
      let levels = geoJson.levels;
      if (featureCollection.length > 0) {

        /**
         * Prepare Top Layer
         * */
        let layer = L.geoJSON(featureCollection, {
          onEachFeature: (feature, latlng) => {
            if (showLabels) {
              var center = feature.getBounds().getCenter();
              var label = L.marker(center, {
                icon: L.divIcon({
                  iconSize: null,
                  className: 'label',
                  html: '<div>' + feature.properties.name + '</div>'
                })
              })
              labels.push(label);
            }
          },
          pointToLayer: function (feature, latlng) {
            var geojsonMarkerOptions = {
              radius: 5,
              color: "#000",
              fillColor: "#ff7800",
              weight: 0,
              opacity: 0,
              fillOpacity: 0
            };
            let circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
            circleMarker.bringToBack();
            return circleMarker
          }
        });
        layer.setStyle((feature) => {
          let color: any = () => {

            return "#ffffff";
          }

          let featureStyle: any = {
            "color": this.bondaryColor(feature, levels),
            "fillColor": color(),
            "fillOpacity": 0,
            "weight": 1,
            "opacity": layerSetting.opacity,
            "stroke": true
          }

          return featureStyle;
        });
        layer.on({
          mouseover: (event) => {
            let hoveredFeature: Feature<GeometryObject> = event.layer.feature;

            let properties: any = hoveredFeature.properties;

            let toolTipContent: string =
              "<div style='color:#333!important;'>" +
              "<table>" +
              "<tr><th style='color:#333!important;'>" + properties.name + "</th></tr>" +
              "</table>" +
              "</div>";
            layer.closeTooltip();
            let popUp = layer.getPopup();
            if (popUp && popUp.isOpen()) {

            } else {
              layer.bindTooltip(toolTipContent, {
                direction: 'top',
                permanent: false,
                sticky: false,
                interactive: true,
                opacity: 2
              })
            }

            let featureStyle: any =
              {
                "fillOpacity": 0.0001,
                "opacity": layerSetting.opacity,
                "stroke": true,
              }

            let hov: any = hoveredFeature.properties;
            if (hov.id == properties.id) {
              featureStyle.fillOpacity = 0.0001;
              featureStyle.color = "#000000";
              featureStyle.weight = 4;
            }

            return featureStyle;

          },
          mouseout: (event) => {
            let hoveredFeature: Feature<GeometryObject> = event.layer.feature;
            let toolTip = layer.getTooltip();
            if (toolTip) {
              layer.closeTooltip();
            }

            layer.setStyle((feature: GeoJSON.Feature<GeoJSON.GeometryObject>) => {
              let properties: any = feature.properties;

              let featureStyle: any =
                {
                  "fillOpacity": 0.0001,
                  "weight": 1,
                  "opacity": layerSetting.opacity,
                  "stroke": true,
                }
              let hov: any = hoveredFeature.properties;
              if (hov.id == properties.id) {
                featureStyle.fillOpacity = 0.0001;
                featureStyle.color = this.bondaryColor(feature, levels);
              }


              return featureStyle;
            });


          },

        });
        boundaries = layer;
      }

    }

    return {name: "Boundary", layer: boundaries, showLabel: showLabels, labels: labels};
  }

  /**
   *
   * @param layerSetting
   * @param layerAnalytics
   * @returns {{name, layer: string}}
   */
  prepareFacilityLayer(layerSetting, layerAnalytics) {
    let layer = [];

    if (layerSetting) {

      let legendObject: any = this.mapService.getMapFacilityLegend(layerSetting);
      let scriptLegend = legendObject.scriptLegend;
      this.updateMapLegendVessel(scriptLegend);


      let features: any = layerSetting.geoFeature;


      let geoJson = this.getGeoJsonObject(features);
      let featureCollection = geoJson.features;
      let levels = geoJson.levels;
      if (featureCollection.length > 0) {

        featureCollection.forEach((feature, featureIndex) => {
          let coord = feature.geometry.coordinates;
          if (coord.length == 2) {
            let featureImage = this.getFeatureImage(feature, scriptLegend);
            var icon = L.divIcon({
              className: 'map-marker',
              iconSize: new L.Point(10, 10),
              iconAnchor: [10, 27],
              html: featureImage
            });
            let featureProperties: any = feature.properties;
            let content = "<div><b>Name: </b>" + featureProperties.name + "</div>"
            layer.push({latLang: L.latLng(coord[1], coord[0]), icon: icon, content: content});
          }
        });

      }

    }

    return {name: layerSetting.name, layer: layer, type: 'facility'};
  }

  getFeatureImage(feature, legend) {
    let icon = "<i class='fa fa-home' aria-hidden='true' ></i>";

    let propertyNames = Object.getOwnPropertyNames(feature.dimensions);
    propertyNames.forEach(dimensionId => {
      legend.classes.forEach(legendClass => {
        if (feature.dimensions[dimensionId] == legendClass.name) {
          if (legendClass.icon == "" || legendClass.icon == null) {

          } else {
            icon = "<img src='../images/orgunitgroup/" + legendClass.icon + "'>"
          }

        }
      })
    });

    return icon;
  }

  /**
   *
   * @param feature
   * @param levels
   * @returns {string|string|string|string|string}
   */
  bondaryColor(feature, levels) {
    let colors = ['black', "black", "blue", "red", "red"];

    return levels.length == 1 ? colors[levels.length - 1] : colors[feature.le - 1];
  }

  bindDataToEventLayers(features, names, pe, dx, ou, rows) {

    return features;
  }

  /**
   * This function takes data form analytics object and associate it
   * with it's respective organisation unit for particular thematic layer
   * @param features
   * @param names
   * @param pe
   * @param dx
   * @param ou
   * @param rows
   * @returns {any}
   */
  bindDataToThematicLayers(features, headers, names, pe, dx, ou, rows) {
    let indexOfData = 0;
    let indexOfPeriod = 0;
    let indexOfOrganisationUnit = 0;
    let indexOfValue = 0;

    headers.forEach((header, headerIndex) => {
      if (header.name == "dx") {
        indexOfData = headerIndex;
      }

      if (header.name == "ou") {
        indexOfOrganisationUnit = headerIndex;
      }

      if (header.name == "pe") {
        indexOfPeriod = headerIndex;
      }

      if (header.name == "value") {
        indexOfValue = headerIndex;
      }
    })

    dx.forEach(element => {
      features.forEach((feature, featureIndex) => {
        let countLows = rows.length;
        features[featureIndex].properties['dataElement'] = {id: element, name: names[element], value: ""}
        rows.forEach((row, rowIndex) => {
          if (row[indexOfData] == element && row[indexOfOrganisationUnit] == features[featureIndex].properties.id) {
            features[featureIndex].properties.dataElement.value = Number(row[indexOfValue]);
          } else if (countLows == rowIndex) {
            features[featureIndex].properties.dataElement.value = "";
          }

        })
      })

    })
    return features
  }


  downloadToPng(documentId, documentName) {
    this.isDownloading = true;
    let dom = document.getElementById(documentId);
    domtoimage.toBlob(dom)
      .then((blob) => {
        saveAs(blob, documentName + '.png');
        this.isDownloading = false;
      });
  }


  /**
   * Stick the legend on the interface
   */
  stickLegendContainer() {
    this.legendIsSticky = !this.legendIsSticky;
  }

  /**
   *
   * @param event
   */
  openLayerController(event) {
    this.layerController = 'visible';
    this.isLegendShown = true;
  }


  /**
   *
   * @param event
   */
  closeLayerController(event) {
    if (!this.legendIsSticky) {
      // this.layerController = 'hidden';
    }

  }

  plainValueChanged(event, plain) {
  }

  /**
   *
   * @param geoFeatures
   * @returns {Array<Feature<any>>}
   */
  getGeoJsonObject(geoFeatures) {
    let levels: Array<Number> = [];
    let geoJsonTemplate: FeatureCollection<any> = {
      "type": "FeatureCollection",
      "features": []
    }


    if (geoFeatures) {
      let levelOne: Array<any> = [];
      let levelTwo: Array<any> = [];
      let levelThree: Array<any> = [];
      let levelFour: Array<any> = [];
      let levelFive: Array<any> = [];
      let levelSix: Array<any> = [];
      let levelSeven: Array<any> = [];
      let levelEight: Array<any> = [];
      let levelNine: Array<any> = [];
      let levelTen: Array<any> = [];

      geoFeatures.forEach((features) => {
        let sampleGeometry: any = {
          "type": "Feature",
          "le": features.le,
          "geometry": {"type": "", "coordinates": []},
          "properties": {"id": "", "name": ""},
          "dimensions": {}
        };
        sampleGeometry.properties.id = features.id;
        sampleGeometry.properties.name = features.na;
        sampleGeometry.geometry.coordinates = JSON.parse(features.co);
        sampleGeometry.dimensions = features.dimensions;


        if (features.le >= 4) {
          sampleGeometry.geometry.type = 'Point';
        } else if (features.le >= 1) {
          sampleGeometry.geometry.type = 'MultiPolygon';
        }

        if (levels.indexOf(features.le) < 0) {
          levels.push(features.le)
        }

        switch (features.le) {
          case 10: {
            levelTen.push(sampleGeometry);
            break;
          }
          case 9: {
            levelNine.push(sampleGeometry);
            break;
          }
          case 8: {

            levelEight.push(sampleGeometry);
            break;
          }
          case 7: {
            levelSeven.push(sampleGeometry);
            break;
          }
          case 6: {
            levelSix.push(sampleGeometry);
            break;
          }
          case 5: {
            levelFive.push(sampleGeometry);
            break;
          }
          case 4: {
            levelFour.push(sampleGeometry);
            break;
          }
          case 3: {
            levelThree.push(sampleGeometry);
            break;
          }
          case 2: {
            levelTwo.push(sampleGeometry);
            break;
          }
          case 1: {
            levelOne.push(sampleGeometry);
            break;
          }
          default: {
            levelOne.push(sampleGeometry);
            break;
          }
        }

      });
      // levelOne
      geoJsonTemplate.features = [...levelOne, ...levelTwo, ...levelThree, ...levelFour, ...levelFive, ...levelSix, ...levelSeven, ...levelEight, ...levelNine, ...levelTen];
    }

    if (geoJsonTemplate.features) {
      return {levels: levels, features: geoJsonTemplate.features};
    }

  }


}
