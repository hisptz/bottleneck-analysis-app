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

  constructor() {}

  get appUrl(): string {
    const dataSelections = this.visualizationLayers[0]
      ? this.visualizationLayers[0].dataSelections
      : [];
    const orgUnit = this.getDataSelectionByDimension(
      dataSelections,
      'ou',
      true,
      this.currentUser
    );

    const period = this.getDataSelectionByDimension(dataSelections, 'pe');

    const dataGroups = this.getDataSelectionGroups(
      dataSelections,
      this.dashboard
    );
    const dashboardDetails = this.dashboard
      ? JSON.stringify({ id: this.dashboard.id, name: this.dashboard.name })
      : '';
    return encodeURI(
      `${this.contextPath}/api/apps/${this.appKey}/index.html?dashboardItemId=${
        this.visualizationId
      }&other=/#/?orgUnit=${orgUnit}&period=${period}&dashboard=${dashboardDetails}&dashboardItem=${
        this.visualizationId
      }&groups=${dataGroups}&focusedDashboardItem=${this.focusedDashboardItem}`
    );
  }

  ngOnInit() {}

  getDataSelectionGroups(dataSelections: any[], dashboard: any) {
    const dxDataSelection =
      _.find(dataSelections, ['dimension', 'dx']) ||
      _.find(dashboard.globalSelections, ['dimension', 'dx']);
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
    const selectionItems = _.map(
      _.flatten(
        _.map(
          _.filter(
            dataSelections,
            dataSelection => dataSelection.dimension === dimension
          ),
          (dataSelection: any) => dataSelection.items
        )
      ),
      (item: any) => {
        const itemName =
          dimension === 'pe' ? this.derivePeriodName(item) : item.name;
        return { id: item.id, name: itemName };
      }
    );

    if (
      dimension === 'ou' &&
      _.some(
        selectionItems,
        (item: any) => item && item.id && item.id.indexOf('USER') !== -1
      )
    ) {
      const userOrgUnits = _.uniqBy(
        _.map([
          ...currentUser.organisationUnits,
          ...currentUser.dataViewOrganisationUnits
        ]),
        'id'
      );

      return singleSelection && userOrgUnits.length > 0
        ? JSON.stringify(userOrgUnits[0])
        : JSON.stringify(userOrgUnits);
    }
    return singleSelection && selectionItems.length > 0
      ? JSON.stringify(selectionItems[0])
      : JSON.stringify(selectionItems);
  }

  derivePeriodName(period: any) {
    let periodName = period.name;

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    if (period.id === 'THIS_YEAR') {
      periodName = year;
    } else if (period.id === 'THIS_MONTH') {
      periodName = `${monthNames[month]} ${year}`;
    }
    return periodName;
  }
}
