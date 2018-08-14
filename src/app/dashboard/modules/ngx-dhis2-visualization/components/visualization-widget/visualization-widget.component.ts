import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationLayer } from '../../models';

@Component({
  selector: 'app-visualization-widget',
  templateUrl: './visualization-widget.component.html',
  styleUrls: ['./visualization-widget.component.scss']
})
export class VisualizationWidgetComponent implements OnInit {
  @Input()
  contextPath: string;
  @Input()
  dashboardId: string;
  @Input()
  focusedDashboardItem: string;
  @Input()
  appKey: string;
  @Input()
  visualizationId: string;
  @Input()
  height: string;
  @Input()
  visualizationLayers: VisualizationLayer[];
  constructor() {}

  get appUrl(): string {
    const dataSelections = this.visualizationLayers[0]
      ? this.visualizationLayers[0].dataSelections
      : [];
    const orgUnit = this.getDataSelectionIdsByDimension(dataSelections, 'ou');

    const period = this.getDataSelectionIdsByDimension(dataSelections, 'pe');
    return `${this.contextPath}/api/apps/${
      this.appKey
    }/index.html?dashboardItemId=${
      this.visualizationId
    }&other=/#/?orgUnit=${orgUnit}&period=${period}&dashboard=${
      this.dashboardId
    }&dashboardItem=${this.visualizationId}&focusedDashboardItem=${
      this.focusedDashboardItem
    }`;
  }

  ngOnInit() {}

  getDataSelectionIdsByDimension(dataSelections: any[], dimension: string) {
    return _.join(
      _.flatten(
        _.map(
          _.filter(
            dataSelections,
            dataSelection => dataSelection.dimension === dimension
          ),
          dataSelection => _.map(dataSelection.items, item => item.id)
        )
      ),
      ';'
    );
  }
}
