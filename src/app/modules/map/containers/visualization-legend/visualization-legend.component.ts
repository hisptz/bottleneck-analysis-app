import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import { TILE_LAYERS } from '../../constants/tile-layer.constant';
import * as fromStore from '../../store';
import { LegendSet } from '../../models/Legend-set.model';

@Component({
  selector: 'app-visualization-legend',
  templateUrl: './visualization-legend.component.html',
  styleUrls: ['./visualization-legend.component.css']
})
export class VisualizationLegendComponent implements OnInit {
  @Input() mapVisualizationObject: any;
  public LegendsTileLayer: any;
  public showButtonIncons: boolean = false;
  public activeLayer: number;
  public visualizationLegends: any = [];
  public legendSetEntities: { [id: string]: LegendSet };
  public sticky$: Observable<boolean>;
  public isFilterSectionOpen$: Observable<boolean>;
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

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.sticky$ = this.store.select(
      fromStore.isVisualizationLegendPinned(this.mapVisualizationObject.componentId)
    );
    this.isFilterSectionOpen$ = this.store.select(
      fromStore.isVisualizationLegendFilterSectionOpen(this.mapVisualizationObject.componentId)
    );
    const layers = this.mapVisualizationObject.layers;
    this.store
      .select(fromStore.getCurrentLegendSets(this.mapVisualizationObject.componentId))
      .subscribe(visualizationLengends => {
        if (visualizationLengends) {
          this.visualizationLegends = visualizationLengends;
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
    const legend = this.visualizationLegends[index];
    const newLegends = this.visualizationLegends.map((legend, i) => {
      if (i === index) {
        const hidden = !legend.hidden;
        return { ...legend, hidden };
      }
      return legend;
    });

    this.store.dispatch(
      new fromStore.UpdateLegendSet({ [this.mapVisualizationObject.componentId]: newLegends })
    );
  }

  changeTileLayer(tileLayer) {
    const mapConfiguration = {
      ...this.mapVisualizationObject.mapConfiguration,
      basemap: tileLayer.name
    };
    this.store.dispatch(
      new fromStore.UpdateVisualizationObjectSuccess({
        ...this.mapVisualizationObject,
        mapConfiguration
      })
    );
  }

  opacityChanged(event, legend) {
    const opacity = event.target.value;
    const newLegends = this.visualizationLegends.map(lg => {
      if (lg === legend) {
        return { ...lg, opacity };
      }
      return lg;
    });

    const { layers } = this.mapVisualizationObject;
    const newLayers = layers.map(layer => {
      if (layer.id === legend.id) {
        return { ...layer, opacity };
      }
      return { ...layer };
    });

    this.store.dispatch(
      new fromStore.UpdateLegendSet({ [this.mapVisualizationObject.componentId]: newLegends })
    );
  }
}
