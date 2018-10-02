import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationLayer } from '../../models';
import { environment } from '../../../../../../environments/environment';

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
    const dataSelections =
      this.dashboard && this.dashboard.globalSelections
        ? this.dashboard.globalSelections
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
      `${environment.production ? this.contextPath : '../../..'}/api/apps/${
        this.appKey
      }/index.html?dashboardItemId=${
        this.visualizationId
      }&other=/#/?orgUnit=${orgUnit}&period=${period}&dashboard=${dashboardDetails}&dashboardItem=${
        this.visualizationId
      }&groups=${dataGroups}`
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
        return dimension === 'pe' ? this.derivePeriodItem(item) : item;
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

  // TODO REMOVE THIS HARDCODING
  derivePeriodItem(period: any) {
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

    switch (period.id) {
      case 'THIS_YEAR':
        return { id: year, name: year };
      case 'LAST_YEAR':
        return { id: year - 1, name: year - 1 };
      case 'THIS_MONTH':
        return {
          id: `${year}${month < 10 ? '0' : ''}${month}`,
          name: `${monthNames[month - 1]} ${year}`
        };
      case 'LAST_MONTH':
        const lastMonth = month === 1 ? 12 : month - 1;
        return {
          id: `${lastMonth === 12 ? year - 1 : year}${
            lastMonth < 10 ? '0' : ''
          }${lastMonth}`,
          name: `${monthNames[lastMonth - 1]} ${
            lastMonth === 12 ? year - 1 : year
          }`
        };
      default:
        return period;
    }
  }
}
