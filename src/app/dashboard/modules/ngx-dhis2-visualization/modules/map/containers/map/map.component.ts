import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';
import * as fromUtils from '../../utils';
import { VisualizationObject } from '../../models/visualization-object.model';

@Component({
  selector: 'app-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./map.component.css'],
  templateUrl: './map.component.html'
})
export class MapComponent implements OnChanges {
  @Input()
  vizObject;
  @Input()
  visualizationLayers;
  @Input()
  visualizationUiConfig;
  @Input()
  visualizationConfig;
  @Input()
  downloadMapFileName;
  @Input()
  hiddenDataElements;
  @Input()
  renamedDataElements;
  @Input()
  loadingData: boolean;
  @Input()
  functionsMapping;
  visualizationObject: VisualizationObject;
  componentId: string;
  displayConfigurations: any;
  public visualizationObject$: Observable<VisualizationObject>;
  constructor(private store: Store<fromStore.MapState>) {
    this.store.dispatch(new fromStore.LoadAllLegendSet());
    this.store.dispatch(new fromStore.AddContectPath());
  }

  ngOnChanges(changes: SimpleChanges) {
    const { vizObject, downloadMapFileName } = changes;

    if (vizObject) {
      const { id } = vizObject.currentValue;
      this.componentId = id;
      this.displayConfigurations = {
        itemHeight: this.vizObject.details.cardHeight,
        mapWidth: '100%'
      };
      this.store.dispatch(new fromStore.InitiealizeVisualizationLegend(id));
      this.transformVisualizationObject(vizObject.currentValue);
      this.visualizationObject$ = this.store.select(fromStore.getCurrentVisualizationObject(id));
    }
    if (downloadMapFileName && downloadMapFileName.currentValue) {
      this.store.dispatch(new fromStore.ConvertDomToPng(this.vizObject.id));
    }
  }

  getVisualizationObject() {
    this.visualizationObject$ = this.store.select(fromStore.getCurrentVisualizationObject(this.componentId));
  }

  transformVisualizationObject(data) {
    // TODO FIND A WAY TO GET GEO FEATURES HERE
    const { visObject } = fromUtils.transformVisualizationObject(data);
    this.visualizationObject = {
      ...this.visualizationObject,
      componentId: this.componentId,
      ...visObject
    };
    this.store.dispatch(new fromStore.AddVisualizationObjectComplete(this.visualizationObject));
  }

  toggleLegendContainerView() {
    this.store.dispatch(new fromStore.ToggleOpenVisualizationLegend(this.componentId));
  }
}
