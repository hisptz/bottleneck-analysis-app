import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationLayer, VisualizationDataSelection } from '../../models';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { getSelectionDimensionsFromAnalytics } from '../../helpers';
import { VisualizationExportService } from '../../services';

@Component({
  selector: 'app-visualization-widget',
  templateUrl: './visualization-widget.component.html',
  styleUrls: ['./visualization-widget.component.scss']
})
export class VisualizationWidgetComponent implements OnInit {
  @Input()
  contextPath: string;
  @Input()
  dashboard: any;
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
  @Input()
  currentUser: any;

  errorMessage: any;
  loading: boolean;
  widgetId: string;
  download: boolean;

  constructor(
    private httpClient: HttpClient,
    private visualizationExportService: VisualizationExportService
  ) {
    this.loading = true;
  }

  get appUrl(): string {
    const dataSelections = _.map(
      this.visualizationLayers || [],
      (visualizationLayer: VisualizationLayer) =>
        visualizationLayer.analytics
          ? getSelectionDimensionsFromAnalytics(visualizationLayer.analytics)
          : visualizationLayer.dataSelections || []
    )[0];

    const orgUnit = this.getDataSelectionByDimension(
      dataSelections || [],
      'ou',
      true,
      this.currentUser
    );

    const period = this.getDataSelectionByDimension(dataSelections || [], 'pe');

    // Find best way to pass group selection that doesnt involve dashboard
    const dataGroups = this.getDataSelectionGroups(
      this.dashboard.globalSelections
    );
    const dashboardDetails = this.dashboard
      ? JSON.stringify({ id: this.dashboard.id, name: this.dashboard.name })
      : '';

    const contextUrl = environment.production ? this.contextPath : '../../../';

    return encodeURI(
      `${contextUrl}/api/apps/${this.appKey}/index.html?dashboardItemId=${
        this.visualizationId
      }&other=/#/?orgUnit=${orgUnit}&period=${period}&dashboard=${dashboardDetails}&dashboardItem=${
        this.visualizationId
      }&groups=${dataGroups}${this.download ? '&download=true' : ''}`
    );
  }

  ngOnInit() {
    this.widgetId = this.visualizationId + '_widget';
    this.httpClient.get(this.appUrl).subscribe(
      () => {
        this.loading = false;
      },
      error => {
        this.loading = false;
        // TODO: Find ways to solve 200 error response as it is success
        if (error.status >= 400) {
          this.errorMessage = {
            statusText: error.statusText,
            statusCode: error.status,
            message:
              error.status !== 404
                ? error.message
                : '<small>Root cause analysis widget is not installed yet. Go to ' +
                  '<a target="_blank" href="' +
                  this.contextPath +
                  '/dhis-web-app-management/#">App Management<a> to' +
                  ' install the widget and then reload this app again</small>'
          };
        }
      }
    );
  }

  getDataSelectionGroups(dataSelections: VisualizationDataSelection[]) {
    const dxDataSelection = _.find(dataSelections, ['dimension', 'dx']);
    return JSON.stringify(
      dxDataSelection
        ? _.map(dxDataSelection.groups || [], (group: any) => {
            return {
              id: group.id,
              name: group.name,
              members: _.map(group.members || [], (member: any) => {
                return { id: member.id, name: member.name };
              })
            };
          })
        : []
    );
  }

  getDataSelectionByDimension(
    dataSelections: any[],
    dimension: string,
    singleSelection: boolean = true,
    currentUser?: any
  ) {
    const selectionItems = _.flatten(
      _.map(
        _.filter(
          dataSelections,
          dataSelection => dataSelection.dimension === dimension
        ),
        (dataSelection: any) => dataSelection.items
      )
    );

    return singleSelection && selectionItems.length > 0
      ? JSON.stringify(selectionItems[0])
      : JSON.stringify(selectionItems);
  }

  onDownloadEvent() {
    this.download = true;
  }
}
