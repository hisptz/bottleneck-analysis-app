import {ApplicationState} from '../application-state';
import {dashboardsSelector} from './dashboards.selector';
import {Dashboard} from '../../model/dashboard';
import * as _ from 'lodash';
export function dashboardPaginationConfigurationSelector(state: ApplicationState) {
  const dashboards = dashboardsSelector(state);
  const itemsPerPage: number = dashboards.length <= 8 ? dashboards.length : 8;
  return {
    id: 'custom',
    itemsPerPage: itemsPerPage,
    currentPage: getCurrentPage(dashboards, state.uiState.currentDashboard, itemsPerPage)
  };
}

function getCurrentPage(dashboards: Dashboard[],  dashboardid: string, itemsPerPage: number) {
  const currentDashboard: Dashboard = _.find(dashboards, ['id', dashboardid]);
  const dashboardIndex: number = _.findIndex(dashboards, currentDashboard) + 1;
  const dashboardCount: number = dashboards.length;
  const pageNumber: number = computePageNumber(dashboardCount, itemsPerPage);

  /**
   * Calculate range
   * @type {Array}
   */
  const ranges = [];
  let pageCount = 1;
  let j: number = itemsPerPage;
  for (let i = 1; i <= itemsPerPage * pageNumber; i += itemsPerPage) {
    ranges.push({min: i, max: j, page: pageCount});
    j += itemsPerPage;
    pageCount++;
  }

  /**
   * find current page based on current dashboard
   */
  let currentPage: number;
  for (const range of ranges) {
    if (dashboardIndex >= range.min && dashboardIndex <= range.max) {
      currentPage = range.page;
      break;
    }
  }

  return currentPage;
}

function computePageNumber(dashboardCount: number, itemsPerPage: number): number {
  const pageNumber: number = ((dashboardCount / itemsPerPage) - 1) + (dashboardCount % itemsPerPage);

  return parseInt((pageNumber.toFixed(0)), 10);
}
