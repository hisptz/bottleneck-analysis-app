import {AppState} from '../app.reducers';
import {createSelector} from '@ngrx/store';
import {Dashboard, DashboardMenuItem, DashboardState} from './dashboard.state';
import * as _ from 'lodash';

const dashboardState = (state: AppState) => state.dashboard;

export const getCurrentDashboardPage = createSelector(dashboardState, (dashboardObject: DashboardState) =>
  dashboardObject.currentDashboardPage);

export const getDashboardPages = createSelector(dashboardState, (dashboardObject: DashboardState) =>
  dashboardObject.dashboardPageNumber);

export const getCurrentDashboard = createSelector(dashboardState, (dashboardObject: DashboardState) =>
  _.find(dashboardObject.dashboards, ['id', dashboardObject.currentDashboard]));

export const getDashboardMenuItems = createSelector(dashboardState,
  (dashboardObject: DashboardState) => dashboardObject.dashboards.length > 0 ? dashboardObject.dashboards.slice(
    getStartItemIndex(dashboardObject.currentDashboardPage, dashboardObject.dashboardPerPage),
    getEndItemIndex(dashboardObject.currentDashboardPage, dashboardObject.dashboardPerPage) + 1)
    .map((dashboard: Dashboard) => mapStateToDashboardMenu(dashboard)) : []);


function getStartItemIndex(pageNumber: number, pageSize: number) {
  return (pageSize * pageNumber) - pageSize;
}

function getEndItemIndex(pageNumber: number, pageSize: number) {
  return (pageSize * pageNumber) - 1;
}

function mapStateToDashboardMenu(dashboard: Dashboard): DashboardMenuItem {
  return {
    id: dashboard.id,
    name: dashboard.name,
    details: dashboard.details
  };
}
