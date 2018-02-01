import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';
import {Layer} from '../../models/layer.model';
import * as fromUtils from '../../utils';
import {getTileLayer} from '../../constants/tile-layer.constant';
import {VisualizationObject} from '../../models/visualization-object.model';
import {MapConfiguration} from '../../models/map-configuration.model';
import {GeoFeature} from '../../models/geo-feature.model';
import * as fromLib from '../../lib';
import {Map, LatLngExpression, control, LatLngBoundsExpression} from 'leaflet';

import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import {interval} from 'rxjs/observable/interval';
import {map, filter, tap, flatMap} from 'rxjs/operators';
import {getSplitedVisualization} from '../../../../store/visualization/helpers/get-splited-visualization.helper';
import {getDimensionValues} from '../../../../store/visualization/helpers/get-dimension-values.helpers';
import {getMapConfiguration} from '../../../../store/visualization/helpers/get-map-configuration.helper';
import * as _ from 'lodash';
import {getGeoFeatureUrl} from '../../../../store/visualization/helpers/get-geo-feature-url.helper';
import {HttpClientService} from '../../../../services/http-client.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  public currentMapLayers$: Observable<Layer[]>;
  public isLoaded$: Observable<boolean>;
  public isLoading$: Observable<boolean>;
  public visualizationObject$: Observable<VisualizationObject>;
  public visualizationObjectEntities$: Observable<any>;
  public visualizationLegendIsOpen$: Observable<boolean>;
  private mapConfiguration: MapConfiguration;
  private Layers: Layer[] = [];
  private visObject: VisualizationObject;
  public loading: boolean = true;
  public hasError: boolean = false;
  public errorMessage: string;
  public legendIsOpen: boolean = false;
  public mapWidth: any = '100%';
  public map: any = {};
  public centeringLayer: any;
  public mapLegend: any;
  public legendMarginRight = '25px';
  public legendMarginLeft = '200px';
  private cardHeight: string = '490px';
  private itemHeight: string = '91.5vh';
  public subtitle: string = '';
  public pinned: boolean = false;
  public operatingLayers: Array<any> = [];
  public isFullScreen: boolean = false;
  public hideTable: boolean = true;
  public showCenterButton: boolean = false;
  public mapOptions: any;
  public visualizationObject: any;
  public componentId = 'RBoGyrUJDOu';
  public mapHeight: string;
  private _data$ = new BehaviorSubject<any>({});
  private _vizObject$ = new BehaviorSubject<any>({});

  @Input() vizObject: any;
  // @Input()
  // set data(value) {
  //   // set the latest value for _data$ BehaviorSubject
  //   this._data$.next(value);
  // }
  //
  // get data() {
  //   // get the latest value from _data$ BehaviorSubject
  //   return this._data$.getValue();
  // }

  constructor(private store: Store<fromStore.MapState>, private http: HttpClientService) {
    this.isLoaded$ = this.store.select(fromStore.isVisualizationObjectsLoaded);
    this.isLoading$ = this.store.select(fromStore.isVisualizationObjectsLoading);
  }

  ngOnInit() {

    this.visualizationObjectEntities$ = this.store.select(fromStore.getAllVisualizationObjectsEntities);

    if (this.vizObject) {
      this.componentId = this.vizObject.id;
      this.itemHeight = this.vizObject.details.cardHeight;
      this.store.dispatch(new fromStore.InitiealizeVisualizationLegend(this.vizObject.id));
      this.visualizationLegendIsOpen$ = this.store.select(
        fromStore.isVisualizationLegendOpen(this.vizObject.id)
      );
      this.transformVisualizationObject(this.vizObject);
    }
    this.store.dispatch(new fromStore.AddContectPath());

  }

  ngAfterViewInit() {
    this.initializeMapContainer();
    // this is a hack to make sure map update zoom and fitbounds
    // interval(400)
    //   .take(1)
    //   .subscribe(() => this.drawMap());
    this.drawMap()
    // Add scale control
    this.mapAddControl({
      type: 'scale',
      imperial: false
    });
  }

  transhformFavourites(data) {
    const {visObject, Layers} = fromUtils.transformFavourites(data);
    this.visObject = {
      ...this.visObject,
      componentId: this.componentId,
      mapConfiguration: visObject['mapConfiguration'],
      layers: Layers
    };

    if (Layers.length) {
      this.store.dispatch(new fromStore.CreateVisualizationObject(this.visObject));
    }
  }

  transformVisualizationObject(data) {
    // TODO FIND A WAY TO GET GEO FEATURES HERE

    this._updateVisualizationWithMapSettings(data)
      .subscribe((visualizationObject: any) => {
        const {visObject} = fromUtils.transformVisualizationObject(visualizationObject);
        console.log(visObject)
        this.visObject = {
          ...this.visObject,
          componentId: this.componentId,
          ...visObject
        };
        this.store.dispatch(new fromStore.AddVisualizationObjectComplete(this.visObject));
      });
  }

  _updateVisualizationWithMapSettings(visualizationObject: any) {
    const newVisualizationObject: any =
      visualizationObject.details.type !== 'MAP'
        ? getSplitedVisualization(visualizationObject)
        : {...visualizationObject};

    const newVisualizationObjectDetails: any = {
      ...newVisualizationObject.details
    };

    const dimensionArea = this._findOrgUnitDimension(
      newVisualizationObject.details.layouts[0].layout
    );
    return new Observable(observer => {
      newVisualizationObjectDetails.mapConfiguration = getMapConfiguration(
        visualizationObject
      );
      const geoFeaturePromises = _.map(
        newVisualizationObject.layers,
        (layer: any) => {
          const visualizationFilters = getDimensionValues(
            layer.settings[dimensionArea],
            []
          );
          const orgUnitFilterObject = _.find(
            visualizationFilters ? visualizationFilters : [],
            ['name', 'ou']
          );
          const orgUnitFilterValue = orgUnitFilterObject
            ? orgUnitFilterObject.value
            : '';
          /**
           * Get geo feature
           * @type {string}
           */
            // TODO find best way to reduce number of geoFeature calls
          const geoFeatureUrl = getGeoFeatureUrl(
            orgUnitFilterValue
            );
          return geoFeatureUrl !== ''
            ? this.http.get(geoFeatureUrl)
            : Observable.of(null);
        }
      );

      Observable.forkJoin(geoFeaturePromises).subscribe(
        (geoFeatureResponse: any[]) => {
          newVisualizationObject.layers = newVisualizationObject.layers.map(
            (layer: any, layerIndex: number) => {
              const newSettings: any = {...layer.settings};
              if (geoFeatureResponse[layerIndex] !== null) {
                newSettings.geoFeature = [...geoFeatureResponse[layerIndex]];
              }
              return {...layer, settings: newSettings};
            }
          );
          newVisualizationObjectDetails.loaded = true;
          observer.next({
            ...newVisualizationObject,
            details: newVisualizationObjectDetails
          });
          observer.complete();
        },
        error => {
          newVisualizationObjectDetails.hasError = true;
          newVisualizationObjectDetails.errorMessage = error;
          newVisualizationObjectDetails.loaded = true;
          observer.next({
            ...newVisualizationObject,
            details: newVisualizationObjectDetails
          });
          observer.complete();
        }
      );
    });
  }

  private _findOrgUnitDimension(visualizationLayout: any) {
    let dimensionArea = '';

    if (_.find(visualizationLayout.columns, ['value', 'ou'])) {
      dimensionArea = 'columns';
    } else if (_.find(visualizationLayout.rows, ['value', 'ou'])) {
      dimensionArea = 'rows';
    } else {
      dimensionArea = 'filters';
    }

    return dimensionArea;
  }

  initializeMapContainer() {
    const mapHeight = fromUtils.refineHeight(this.itemHeight);
    const container = fromUtils.prepareMapContainer(
      this.componentId,
      this.itemHeight,
      this.mapWidth,
      this.isFullScreen
    );
    const otherOptions = {
      zoomControl: false,
      scrollWheelZoom: false,
      worldCopyJump: true
    };
    this.map = new Map(container, otherOptions);
  }

  initializeMapBaseLayer(mapConfiguration: MapConfiguration) {
    const center: LatLngExpression = [
      Number(fromLib._convertLatitudeLongitude(mapConfiguration.latitude)),
      Number(fromLib._convertLatitudeLongitude(mapConfiguration.longitude))
    ];
    const zoom = mapConfiguration.zoom;

    const mapTileLayer = getTileLayer(mapConfiguration.basemap);
    const baseMapLayer = fromLib.LayerType[mapTileLayer.type](mapTileLayer);

    this.map.setView(center, zoom, {reset: true});
    // Add baseMap Layer;
    this.map.addLayer(baseMapLayer);
  }

  drawMap() {
    this.store.select(
      fromStore.getCurrentVisualizationObject(this.componentId)
    ).subscribe(visualizationObject => {
        if (visualizationObject) {
          console.log(visualizationObject);
          const overlayLayers = fromLib.GetOverLayLayers(visualizationObject);
          this.map.eachLayer(layer => this.map.removeLayer(layer));
          this.map.invalidateSize();
          this.initializeMapBaseLayer(visualizationObject.mapConfiguration);
          const layersBounds = [];
          let legendSets = [];
          overlayLayers.map((layer, index) => {
            const {bounds, legendSet} = layer;
            if (bounds) {
              layersBounds.push(bounds);
            }
            if (legendSet && legendSet.legend) {
              legendSets = [...legendSets, legendSet];
            }
            this.createLayer(layer, index);
          });

          if (layersBounds.length) {
            this.layerFitBound(layersBounds);
          }
          if (legendSets.length) {
            this.store.dispatch(new fromStore.AddLegendSet({[this.componentId]: legendSets}));
          }
        }
      });
  }

  mapAddControl(mapControl) {
    let newControl = mapControl;

    if (mapControl.type && control[mapControl.type]) {
      newControl = control[mapControl.type](mapControl);
    }
    this.map.addControl(newControl);
  }

  createLayer(optionsLayer, index) {
    const {displaySettings, id, geoJsonLayer, visible} = optionsLayer;
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

  onLayerAdd(index, optionsLayer) {
  }

  setLayerVisibility(isVisible, layer) {
    if (isVisible && this.map.hasLayer(layer) === false) {
      this.map.addLayer(layer);
    } else if (!isVisible && this.map.hasLayer(layer) === true) {
      this.map.removeLayer(layer);
    }
  }

  layerFitBound(bounds: LatLngBoundsExpression) {
    this.map.invalidateSize();
    this.map.fitBounds(bounds);
  }

  zoomIn(event) {
    this.map.zoomIn();
  }

  zoomOut(event) {
    this.map.zoomOut();
  }

  recenterMap(event) {
    this.map.eachLayer(layer => console.log(layer.getBounds()));
  }

  toggleLegendContainerView() {
    this.store.dispatch(new fromStore.ToggleOpenVisualizationLegend(this.componentId));
  }
}
