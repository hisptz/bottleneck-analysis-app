import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import * as _ from 'lodash';

import { TILE_LAYERS } from '../../constants/tile-layer.constant';
import * as fromStore from '../../store';
import { LegendSet } from '../../models/Legend-set.model';

@Component({
  selector: 'app-visualization-legend',
  templateUrl: './visualization-legend.component.html',
  styleUrls: ['./visualization-legend.component.css']
})
export class VisualizationLegendComponent implements OnInit, OnDestroy {
  @Input() mapVisualizationObject: any;
  @Input() currentLayersVisibility: any;
  public LegendsTileLayer: any;
  public showButtonIncons = false;
  public activeLayer: string;
  public visualizationLegends: any = [];
  public legendSetEntities: { [id: string]: LegendSet };
  public sticky$: Observable<boolean>;
  public isFilterSectionOpen$: Observable<boolean>;
  public visualizationLegends$: ISubscription;
  public baseLayerLegend$: ISubscription;
  public baseLayerLegend;
  public showFilterContainer = false;
  public buttonTop: string;
  public buttonHeight: string;
  public tileLayers: any;
  openTileLegend = false;
  isRemovable = false;
  toggleBoundary = true;
  boundaryLegend: Array<any> = [];
  showDownload = false;
  showUpload = false;
  layerSelectionForm = false;
  showTransparent: boolean;
  displayNone: boolean;
  currentPage = 1;
  itemsPerPage = 3;
  absoluteIndex: number;

  constructor(private store: Store<fromStore.MapState>) {
    this.displayNone = false;
    this.showTransparent = false;
    this.openTileLegend = false;
    this.isRemovable = false;
    this.toggleBoundary = false;
    this.tileLayers = TILE_LAYERS;
  }

  ngOnInit() {
    this.sticky$ = this.store.select(fromStore.isVisualizationLegendPinned(this.mapVisualizationObject.componentId));

    this.isFilterSectionOpen$ = this.store.select(
      fromStore.isVisualizationLegendFilterSectionOpen(this.mapVisualizationObject.componentId)
    );

    this.visualizationLegends$ = this.store
      .select(fromStore.getCurrentLegendSets(this.mapVisualizationObject.componentId))
      .subscribe(visualizationLengends => {
        if (visualizationLengends) {
          this.visualizationLegends = Object.keys(visualizationLengends)
            .map(key => visualizationLengends[key])
            .reverse();
          this.activeLayer = this.activeLayer || this.visualizationLegends[0].layer;
        }
      });

    this.baseLayerLegend$ = this.store
      .select(fromStore.getCurrentBaseLayer(this.mapVisualizationObject.componentId))
      .subscribe(baselayerLegend => {
        if (baselayerLegend) {
          this.baseLayerLegend = { ...baselayerLegend };
        }
      });
  }

  showButtonIcons() {
    this.showButtonIncons = true;
  }

  hideButtonIcons() {
    this.showButtonIncons = false;
  }

  setActiveItem(activeLayer, e) {
    e.stopPropagation();
    if (activeLayer === 'baseMap') {
      this.LegendsTileLayer = Object.keys(TILE_LAYERS).map(layerKey => TILE_LAYERS[layerKey]);
    }

    if (this.showFilterContainer) {
      this.closeFilters();
    }

    this.buttonTop = e.currentTarget.offsetTop;
    this.buttonHeight = e.currentTarget.offsetHeight;

    this.activeLayer = activeLayer;
  }

  mapDownload(e, fileType, mapLegends) {
    e.stopPropagation();
    if (fileType === 'csv') {
      this.store.dispatch(
        new fromStore.DownloadCSV({
          visualization: this.mapVisualizationObject,
          mapLegends: mapLegends
        })
      );
    }

    if (fileType === 'kml') {
      this.store.dispatch(
        new fromStore.DownloadKML({
          visualization: this.mapVisualizationObject,
          mapLegends: mapLegends
        })
      );
    }

    if (fileType === 'gml') {
      this.store.dispatch(
        new fromStore.DownloadGML({
          visualization: this.mapVisualizationObject,
          mapLegends: mapLegends
        })
      );
    }

    if (fileType === 'shapefile') {
      this.store.dispatch(
        new fromStore.DownloadShapeFile({
          visualization: this.mapVisualizationObject,
          mapLegends: mapLegends
        })
      );
    }

    if (fileType === 'geojson') {
      this.store.dispatch(
        new fromStore.DownloadJSON({
          visualization: this.mapVisualizationObject,
          mapLegends: mapLegends
        })
      );
    }
  }

  stickLegendContainer(e) {
    e.stopPropagation();
    this.store.dispatch(new fromStore.TogglePinVisualizationLegend(this.mapVisualizationObject.componentId));
  }

  closeLegendContainer(e) {
    e.stopPropagation();
    this.store.dispatch(new fromStore.CloseVisualizationLegend(this.mapVisualizationObject.componentId));
  }

  openFilters(e) {
    e.stopPropagation();
    this.showFilterContainer = true;
    this.store.dispatch(new fromStore.ToggleVisualizationLegendFilterSection(this.mapVisualizationObject.componentId));
  }

  closeFilters() {
    this.showFilterContainer = false;
    this.store.dispatch(new fromStore.CloseVisualizationLegendFilterSection(this.mapVisualizationObject.componentId));
  }

  hideAndShowLayer(layer, e) {
    e.stopPropagation();
    const { componentId } = this.mapVisualizationObject;
    this.store.dispatch(new fromStore.ToggleLayerVisibilitySettings({ componentId, layer }));
  }

  toggleBaseLayer(event) {
    event.stopPropagation();
    const { hidden } = this.baseLayerLegend;
    const isHidden = !hidden;
    const changedBaseLayer = false;
    const payload = {
      [this.mapVisualizationObject.componentId]: {
        ...this.baseLayerLegend,
        hidden: isHidden,
        changedBaseLayer
      }
    };
    this.store.dispatch(new fromStore.UpdateBaseLayer(payload));
  }

  changeBaseLayerOpacity(event) {
    event.stopPropagation();
    const opacity = event.target.value;
    const changedBaseLayer = false;
    const payload = {
      [this.mapVisualizationObject.componentId]: {
        ...this.baseLayerLegend,
        opacity,
        changedBaseLayer
      }
    };
    this.store.dispatch(new fromStore.UpdateBaseLayer(payload));
  }

  changeTileLayer(tileLayer) {
    const { name } = tileLayer;
    const changedBaseLayer = true;
    const payload = {
      [this.mapVisualizationObject.componentId]: { ...this.baseLayerLegend, name, changedBaseLayer }
    };
    this.store.dispatch(new fromStore.UpdateBaseLayer(payload));
  }

  opacityChanged(event, legend) {
    event.stopPropagation();
    const opacity = event.target.value;
    const { componentId } = this.mapVisualizationObject;
    const newLegend = { [legend.layer]: { ...legend, opacity } };

    this.store.dispatch(
      new fromStore.ChangeLegendSetLayerOpacity({
        componentId,
        legend: newLegend
      })
    );
  }

  handlePageChange(event) {
    this.currentPage = event;
    const absoluteIndex = this.itemsPerPage * (this.currentPage - 1);
    this.activeLayer = this.visualizationLegends[absoluteIndex].layer;
    this.closeFilters();
  }

  toggleDownload(event) {
    event.stopPropagation();
    this.showDownload = !this.showDownload;
  }

  toggleDataTableView(event) {
    event.stopPropagation();
    this.store.dispatch(new fromStore.ToggleDataTable(this.mapVisualizationObject.componentId));
  }

  dropped(event) {
    const orderedLayers = this.visualizationLegends.map(({ layer }) => layer);
    const { layers } = this.mapVisualizationObject;
    const newLayers = orderedLayers.map(layerId => layers.filter(layer => layer.id === layerId)[0]);
    const vizObject = { ...this.mapVisualizationObject, layers: newLayers };
    this.store.dispatch(new fromStore.UpdateVisualizationObjectSuccess(vizObject));
  }

  ngOnDestroy() {
    this.baseLayerLegend$.unsubscribe();
    this.visualizationLegends$.unsubscribe();
  }
}
