import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationConfig } from '../../models/visualization-config.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { VisualizationLayer } from '../../models/visualization-layer.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'visualization-body-section',
  templateUrl: 'visualization-body-section.html',
  styleUrls: ['./visualization-body-section.css']
})
export class VisualizationBodySectionComponent {
  @Input()
  id: string;
  @Input()
  appKey: string;
  @Input()
  baseUrl: string;
  @Input()
  visualizationLayers: VisualizationLayer[];
  @Input()
  visualizationConfig: VisualizationConfig;
  @Input()
  visualizationUiConfig: VisualizationUiConfig;

  @Output()
  updateVisualizationLayer: EventEmitter<any> = new EventEmitter<any>();
  get metadataIdentifiers() {
    return _.uniq(
      _.flatten(
        _.map(this.visualizationLayers, layer => layer.metadataIdentifiers)
      )
    );
  }

  get appUrl(): string {
    return `${this.visualizationConfig.contextPath}/api/apps/${
      this.appKey
    }/index.html?dashboardItemId=${
      this.id
    }/#/orgUnit=orgUnitId&period=periodId&dashboard=dashboardId`;
  }
  constructor() {}

  onVisualizationLayerUpdate(visualizationLayer: any) {
    this.updateVisualizationLayer.emit(visualizationLayer);
  }
}
