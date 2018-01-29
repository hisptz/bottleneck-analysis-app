import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TILE_LAYERS } from '../../constants/tile-layer.constant';
import * as fromStore from '../../store';
import { LegendSet } from '../../models/Legend-set.model';

@Component({
  selector: 'app-visualization-legend',
  templateUrl: './visualization-legend.component.html',
  styleUrls: ['./visualization-legend.component.css']
})
export class VisualizationLegendComponent implements OnInit {
  @Input() mapVsualizationObject: any;
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
  public isNotDashboard: boolean = false;
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
    this.sticky$ = this.store.select(fromStore.isVisualizationLegendPinned);
    this.isFilterSectionOpen$ = this.store.select(fromStore.isVisualizationLegendFilterSectionOpen);
    this.store.select(fromStore.getAllLegendSetObjectsEntities).subscribe(lg => {
      this.legendSetEntities = lg;
    });
    const layers = this.mapVsualizationObject.layers;
    if (layers.length) {
      this.visualizationLegends = layers.reduce((vizLg = [], currentLayer, index) => {
        const { type, id, name } = currentLayer;
        const displayName = this.legendSetEntities[id].legend.title;
        if (this.legendSetEntities[id]) {
          const legendObject = {
            ...this.legendSetEntities[id],
            displayName,
            name: currentLayer.displayName,
            type
          };
          return [...vizLg, legendObject];
        }
      }, []);
    }
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
    this.store.dispatch(new fromStore.TogglePinVisualizationLegend());
  }

  closeLegendContainer(e) {
    e.stopPropagation();
    this.store.dispatch(new fromStore.CloseVisualizationLegend());
  }

  openFilters(e) {
    e.stopPropagation();
    this.showFilterContainer = true;
    this.store.dispatch(new fromStore.ToggleVisualizationLegendFilterSection());
  }

  toggleLayerView(e) {}
}
