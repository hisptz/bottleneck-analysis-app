import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import {TILE_LAYERS} from '../../constants/tile-layer.constant';
import * as fromStore from '../../store';
import {LegendSet} from '../../models/Legend-set.model';
import {ISubscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-visualization-legend',
  templateUrl: './visualization-legend.component.html',
  styleUrls: ['./visualization-legend.component.css']
})
export class VisualizationLegendComponent implements OnInit, OnDestroy {
  @Input() mapVisualizationObject: any;
  public LegendsTileLayer: any;
  public showButtonIncons: boolean = false;
  public activeLayer: number = -1;
  public visualizationLegends: any = [];
  public legendSetEntities: { [id: string]: LegendSet };
  public sticky$: Observable<boolean>;
  public isFilterSectionOpen$: Observable<boolean>;
  public visualizationLegends$: ISubscription;
  public baseLayerLegend$: ISubscription;
  public baseLayerLegend;
  public showFilterContainer: boolean = false;
  public buttonTop: string;
  public buttonHeight: string;
  openTileLegend: boolean = false;
  isRemovable: boolean = false;
  toggleBoundary: boolean = true;
  boundaryLegend: Array<any> = [];
  showDownload: boolean = false;
  showUpload: boolean = false;
  layerSelectionForm: boolean = false;
  showTransparent: boolean = false;
  displayNone: boolean = false;
  p: number = 1;

  constructor(private store: Store<fromStore.MapState>) {
  }

  ngOnInit() {
    this.sticky$ = this.store.select(
      fromStore.isVisualizationLegendPinned(this.mapVisualizationObject.componentId)
    );
    this.isFilterSectionOpen$ = this.store.select(
      fromStore.isVisualizationLegendFilterSectionOpen(this.mapVisualizationObject.componentId)
    );
    const layers = this.mapVisualizationObject.layers;

    this.visualizationLegends$ = this.store
      .select(fromStore.getCurrentLegendSets(this.mapVisualizationObject.componentId))
      .subscribe(visualizationLengends => {
        if (visualizationLengends) {
          this.visualizationLegends = Object.keys(visualizationLengends).map(
            key => visualizationLengends[key]
          );
          this.activeLayer = 0;
        }
      });

    this.baseLayerLegend$ = this.store
      .select(fromStore.getCurrentBaseLayer(this.mapVisualizationObject.componentId))
      .subscribe(baselayerLegend => {
        if (baselayerLegend) {
          this.baseLayerLegend = {...baselayerLegend};
        }
      });
  }

  showButtonIcons() {
    this.showButtonIncons = true;
  }

  hideButtonIcons() {
    this.showButtonIncons = false;
  }

  setActiveItem(index, e) {
    // e.stopPropagation();
    if (index === -1) {
      this.LegendsTileLayer = Object.keys(TILE_LAYERS).map(layerKey => TILE_LAYERS[layerKey]);
    }

    this.buttonTop = e.currentTarget.offsetTop;
    this.buttonHeight = e.currentTarget.offsetHeight;

    if (this.activeLayer === index) {
      this.activeLayer = -2;
      this.showFilterContainer = false;
    } else {
      this.activeLayer = index;
      this.showFilterContainer = false;
    }
  }

  mapDownload(e, fileType, mapLegends) {
    e.stopPropagation();
    this.store.dispatch(
      new fromStore.DownloadCSV(this.mapVisualizationObject)
    );
  }

  stickLegendContainer(e) {
    e.stopPropagation();
    this.store.dispatch(
      new fromStore.TogglePinVisualizationLegend(this.mapVisualizationObject.componentId)
    );
  }

  closeLegendContainer(e) {
    e.stopPropagation();
    this.store.dispatch(
      new fromStore.CloseVisualizationLegend(this.mapVisualizationObject.componentId)
    );
  }

  openFilters(e) {
    e.stopPropagation();
    this.showFilterContainer = true;
    this.store.dispatch(
      new fromStore.ToggleVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }

  toggleLayerView(index, e) {
    e.stopPropagation();
    const _legend = this.visualizationLegends[index];
    const {componentId} = this.mapVisualizationObject;
    const hidden = !_legend.hidden;
    const newLegend = {..._legend, hidden};
    const legend = {[newLegend.layer]: {...newLegend}};

    this.store.dispatch(new fromStore.UpdateLegendSet({componentId, legend}));
  }

  toggleBaseLayer(event) {
    event.stopPropagation();
    const {hidden} = this.baseLayerLegend;
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
    const {name} = tileLayer;
    const changedBaseLayer = true;
    const payload = {
      [this.mapVisualizationObject.componentId]: {...this.baseLayerLegend, name, changedBaseLayer}
    };
    this.store.dispatch(new fromStore.UpdateBaseLayer(payload));
  }

  opacityChanged(event, legend) {
    event.stopPropagation();
    const opacity = event.target.value;
    const {componentId} = this.mapVisualizationObject;
    const newLegend = {[legend.layer]: {...legend, opacity}};

    this.store.dispatch(
      new fromStore.ChangeLegendSetLayerOpacity({
        componentId,
        legend: newLegend
      })
    );
  }

  handlePageChange(event) {
    this.p = event;
  }

  ngOnDestroy() {
    this.baseLayerLegend$.unsubscribe();
    this.visualizationLegends$.unsubscribe();
  }
}
