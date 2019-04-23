import { Component, ChangeDetectionStrategy, Input, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import * as fromStore from '../../store';
import * as _ from 'lodash';
import * as fromUtils from '../../utils';
import { VisualizationObject } from '../../models/visualization-object.model';
import { getSplitedVisualizationLayers } from '../../../../helpers';
import { visitSiblingRenderNodes } from '@angular/core/src/view/util';
import { sanitizeResourceUrl } from '@angular/core/src/sanitization/sanitization';

@Component({
  selector: 'app-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./map.component.css'],
  templateUrl: './map.component.html'
})
export class MapComponent implements OnInit {
  @Input() id;
  @Input() visualizationLayers: any;
  @Input() visualizationConfig: any;
  @Input() visualizationUiConfig: any;
  visualizationObject: VisualizationObject;
  displayConfigurations: any;
  public visualizationObject$: Observable<VisualizationObject>;
  constructor(private store: Store<fromStore.MapState>) {
    this.store.dispatch(new fromStore.LoadAllLegendSet());
    this.store.dispatch(new fromStore.AddContectPath());
  }

  ngOnInit() {
    this.store.dispatch(new fromStore.InitiealizeVisualizationLegend(this.id));

    // console.log("RAJABU: " + JSON.stringify(this.visualizationLayers))

    this.transformVisualizationObject(this.visualizationConfig, this.visualizationLayers, this.id);
    this.visualizationObject$ = this.store.select(fromStore.getCurrentVisualizationObject(this.id));
  }

  getVisualizationObject() {
    this.visualizationObject$ = this.store.select(fromStore.getCurrentVisualizationObject(this.id));
  }

  transformVisualizationObject(visualizationConfig, visualizationLayers, id) {
    // TODO FIND A WAY TO GET GEO FEATURES HERE
    const cleanedOutLayers = visualizationLayers.map(vizLayer => {
      const { analytics } = vizLayer;
      const rows = analytics.rows.filter(row => _.uniq(row).length === row.length);
      const newAnalytics = { ...analytics, rows };
      return { ...vizLayer, analytics: newAnalytics };
    });

    if (visualizationConfig.currentType === 'MAP') {
      let analytics;

        this.displayConfigurations = { ...this.visualizationUiConfig, ...this.visualizationLayers[0].config };
        const layersMetadata = getSplitedVisualizationLayers(visualizationConfig.type, cleanedOutLayers);
        const { visObject } = fromUtils.transformVisualizationObject(visualizationConfig, layersMetadata, id);

        const crudVisualizationObject = {
          ...this.visualizationObject,
          componentId: this.id,
          ...visObject
        };

        const analyticsKeys = Object.keys(crudVisualizationObject.analytics)
        const layersUIDs = []
        const geoFeatureSanitizedAnalytics = {}
        analyticsKeys.map((analyticsKey) => {
          if (analyticsKey) {
            if (crudVisualizationObject.analytics[analyticsKey].rows.length != 0) {
              crudVisualizationObject.analytics[analyticsKey].rows.map((rowData) => {
                if (rowData[4] === 'k1ZoaGAFVL3') {
                  geoFeatureSanitizedAnalytics[analyticsKey.toString()] = crudVisualizationObject.analytics[analyticsKey]
                  analytics = geoFeatureSanitizedAnalytics;
                  const newAnalytics = { ...crudVisualizationObject, analytics };
                  newAnalytics.layers.filter((layer) => {
                    if (layer.id === analyticsKey) {
                      if (!layersUIDs.includes(analyticsKey)) {
                        layersUIDs.push(analyticsKey)
                      }
                    }
                  })
                } else {
                  console.log('[MAP Analytics] No Row Data Matching That UID')
                }
              });
            } else {
  
            }
          } else {
            console.log('[MAP Analytics] Missing analytics in the Visualization Object.')
          }
        });
        analytics = geoFeatureSanitizedAnalytics;
        const newAnalytics = { ...crudVisualizationObject, analytics };
        const layers = newAnalytics.layers.filter((layer) => { 
          return layersUIDs.includes(layer.id) 
        }).map((layer, pos) => { 
          (pos === 0) ? layer.visible = true : layer.visible = false; return layer 
        })
        const sanitizedVisualizationObject = { ...crudVisualizationObject, layers }
        this.visualizationObject = sanitizedVisualizationObject
    } else {
      console.log('[MAP Visualization] Visualization type is not MAP')
    }
    this.store.dispatch(new fromStore.AddVisualizationObjectComplete(this.visualizationObject));
  }

  toggleLegendContainerView() {
    this.store.dispatch(new fromStore.ToggleOpenVisualizationLegend(this.id));
  }
}
