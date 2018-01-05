import * as dashboard from './dashboard.state';
import {DashboardAction, DashboardActions} from './dashboard.actions';
import * as dashboardHelpers from './helpers/index';
import {Dashboard} from './dashboard.state';
import * as _ from 'lodash';

export function dashboardReducer(state: dashboard.DashboardState = dashboard.INITIAL_DASHBOARD_STATE, action: DashboardAction) {
  switch (action.type) {
    case DashboardActions.LOAD_SUCCESS:
      const newDashboards: Dashboard[] = _.map(action.payload.dashboards, (dashboardObject: any) =>
        dashboardHelpers.mapStateToDashboardObject(dashboardObject, null, action.payload.currentUser.id));

      return {
        ...state,
        dashboards: [...newDashboards],
        dashboardPageNumber: Math.ceil(newDashboards.length / state.dashboardPerPage)
      };
    case DashboardActions.SET_CURRENT:
      return {
        ...state,
        currentDashboard: action.payload,
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          state.dashboards,
          action.payload,
          state.dashboardPerPage
        )
      };

    case DashboardActions.CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentDashboardPage: state.currentDashboardPage + action.payload
      };

    case DashboardActions.CREATE: {
      const newDashboardsWithToBeCreated: Dashboard[] = [..._.sortBy([...state.dashboards,
        dashboardHelpers.mapStateToDashboardObject({name: action.payload}, 'create')], ['name'])];
      return {
        ...state,
        dashboards: newDashboardsWithToBeCreated,
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          newDashboardsWithToBeCreated,
          '0',
          state.dashboardPerPage
        )
      };
    }

    case DashboardActions.CREATE_SUCCESS: {
      const createdDashboardIndex = _.findIndex(state.dashboards, _.find(state.dashboards, ['id', '0']));

      const newDashboardsWithCreated = createdDashboardIndex !== -1 ? [
        ...state.dashboards.slice(0, createdDashboardIndex),
        dashboardHelpers.mapStateToDashboardObject(action.payload, 'created'),
        ...state.dashboards.slice(createdDashboardIndex + 1)
      ] : state.dashboards;

      return {
        ...state,
        dashboards: newDashboardsWithCreated,
      };
    }

    case DashboardActions.RENAME: {
      const availableDashboard: Dashboard = _.find(state.dashboards, ['id', action.payload.id]);
      const createdDashboardIndex = _.findIndex(state.dashboards, availableDashboard);

      const newDashboardsWithToBeUpdated = createdDashboardIndex !== -1 ? [
        ...state.dashboards.slice(0, createdDashboardIndex),
        dashboardHelpers.mapStateToDashboardObject(availableDashboard, 'update'),
        ...state.dashboards.slice(createdDashboardIndex + 1)
      ] : state.dashboards;

      return {
        ...state,
        dashboards: newDashboardsWithToBeUpdated,
      };
    }

    case DashboardActions.RENAME_SUCCESS: {
      const renamedDashboardIndex = _.findIndex(state.dashboards, _.find(state.dashboards, ['id', action.payload.id]));

      const newDashboardsWithUpdated: Dashboard[] = renamedDashboardIndex !== -1 ?
        _.sortBy([
          ...state.dashboards.slice(0, renamedDashboardIndex),
          dashboardHelpers.mapStateToDashboardObject(action.payload, 'updated'),
          ...state.dashboards.slice(renamedDashboardIndex + 1)
        ], ['name']) : [...state.dashboards];
      return {
        ...state,
        dashboards: newDashboardsWithUpdated,
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          newDashboardsWithUpdated,
          action.payload.id,
          state.dashboardPerPage
        )
      };
    }

    default:
      return state;
  }
}
