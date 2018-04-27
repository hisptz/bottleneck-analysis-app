import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import { getTileLayer } from '../../constants/tile-layer.constant';
import { VisualizationObject } from '../../models/visualization-object.model';
import { MapConfiguration } from '../../models/map-configuration.model';
import { GeoFeature } from '../../models/geo-feature.model';
import * as fromLib from '../../lib';
import { Map, LatLngExpression, control, LatLngBoundsExpression } from 'leaflet';
import { getSplitedVisualization } from '../../../../store/visualization/helpers';

import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { map, filter, tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  styles: [
    `:host {
      display: block;
      width: 100%;
      height: 100%;
    }
  }`
  ]
})
export class MapComponent implements OnInit {
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
  public displayConfigurations: any = {};
  private _data$ = new BehaviorSubject<any>({});
  private _vizObject$ = new BehaviorSubject<any>({});

  @Input() vizObject: any;

  constructor(private store: Store<fromStore.MapState>) {
    this.isLoaded$ = this.store.select(fromStore.isVisualizationObjectsLoaded);
    this.isLoading$ = this.store.select(fromStore.isVisualizationObjectsLoading);
    this.store.dispatch(new fromStore.LoadAllLegendSet());
  }

  ngOnInit() {
    this.store.dispatch(new fromStore.AddContectPath());
    if (this.vizObject) {
      this.componentId = this.vizObject.id;
      this.itemHeight = this.vizObject.details.cardHeight;
      this.displayConfigurations = {
        itemHeight: this.vizObject.details.cardHeight,
        mapWidth: '100%'
      };
      this.store.dispatch(new fromStore.InitiealizeVisualizationLegend(this.vizObject.id));
      this.visualizationLegendIsOpen$ = this.store.select(
        fromStore.isVisualizationLegendOpen(this.vizObject.id)
      );
      this.transformVisualizationObject(this.vizObject);
      this.visualizationObject$ = this.store.select(
        fromStore.getCurrentVisualizationObject(this.vizObject.id)
      );
    }
  }

  transhformFavourites(data) {
    const { visObject, Layers } = fromUtils.transformFavourites(data);
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
    const newData = getSplitedVisualization(data);
    const { visObject } = fromUtils.transformVisualizationObject(newData);
    this.visObject = {
      ...this.visObject,
      componentId: this.componentId,
      ...visObject
    };
    this.store.dispatch(new fromStore.AddVisualizationObjectComplete(this.visObject));
  }

  toggleLegendContainerView() {
    this.store.dispatch(new fromStore.ToggleOpenVisualizationLegend(this.componentId));
  }
}
