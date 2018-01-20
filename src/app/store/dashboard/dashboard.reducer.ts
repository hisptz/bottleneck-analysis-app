import * as dashboard from './dashboard.state';
import { DashboardAction, DashboardActions } from './dashboard.actions';
import * as dashboardHelpers from './helpers/index';
import { Dashboard, DashboardSharing } from './dashboard.state';
import * as _ from 'lodash';
import { updateWithHeaderSelectionCriterias } from './helpers/map-state-to-dashboard-search-items.helper';

export function dashboardReducer(
  state: dashboard.DashboardState = dashboard.INITIAL_DASHBOARD_STATE,
  action: DashboardAction
) {
  switch (action.type) {
    case DashboardActions.LOAD_SUCCESS:
      const newDashboards: Dashboard[] = _.map(
        action.payload.dashboards,
        (dashboardObject: any) =>
          dashboardHelpers.mapStateToDashboardObject(
            dashboardObject,
            null,
            action.payload.currentUser.id
          )
      );

      return {
        ...state,
        dashboards: [...newDashboards],
        dashboardPageNumber: Math.ceil(
          newDashboards.length / state.dashboardPerPage
        )
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
      const newDashboardsWithToBeCreated: Dashboard[] = [
        ..._.sortBy(
          [
            ...state.dashboards,
            dashboardHelpers.mapStateToDashboardObject(
              { name: action.payload },
              'create'
            )
          ],
          ['name']
        )
      ];
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
      const createdDashboardIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', '0'])
      );

      const newDashboardsWithCreated =
        createdDashboardIndex !== -1
          ? [
              ...state.dashboards.slice(0, createdDashboardIndex),
              dashboardHelpers.mapStateToDashboardObject(
                action.payload,
                'created'
              ),
              ...state.dashboards.slice(createdDashboardIndex + 1)
            ]
          : state.dashboards;

      return {
        ...state,
        dashboards: newDashboardsWithCreated
      };
    }

    case DashboardActions.RENAME: {
      const availableDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.id
      ]);
      const createdDashboardIndex = _.findIndex(
        state.dashboards,
        availableDashboard
      );

      const newDashboardsWithToBeUpdated =
        createdDashboardIndex !== -1
          ? [
              ...state.dashboards.slice(0, createdDashboardIndex),
              dashboardHelpers.mapStateToDashboardObject(
                availableDashboard,
                'update'
              ),
              ...state.dashboards.slice(createdDashboardIndex + 1)
            ]
          : state.dashboards;

      return {
        ...state,
        dashboards: newDashboardsWithToBeUpdated
      };
    }

    case DashboardActions.RENAME_SUCCESS: {
      const renamedDashboardIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', action.payload.id])
      );

      const newDashboardsWithUpdated: Dashboard[] =
        renamedDashboardIndex !== -1
          ? _.sortBy(
              [
                ...state.dashboards.slice(0, renamedDashboardIndex),
                dashboardHelpers.mapStateToDashboardObject(
                  action.payload,
                  'updated'
                ),
                ...state.dashboards.slice(renamedDashboardIndex + 1)
              ],
              ['name']
            )
          : [...state.dashboards];
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

    case DashboardActions.DELETE: {
      const dashboardToDelete = _.find(state.dashboards, [
        'id',
        action.payload
      ]);
      const dashboardToDeleteIndex = _.findIndex(
        state.dashboards,
        dashboardToDelete
      );

      return {
        ...state,
        dashboards:
          dashboardToDeleteIndex !== -1
            ? [
                ...state.dashboards.slice(0, dashboardToDeleteIndex),
                dashboardHelpers.mapStateToDashboardObject(
                  dashboardToDelete,
                  'delete'
                ),
                ...state.dashboards.slice(dashboardToDeleteIndex + 1)
              ]
            : [...state.dashboards]
      };
    }
    case DashboardActions.COMMIT_DELETE: {
      const dashboardDeletedIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', action.payload])
      );
      return {
        ...state,
        dashboards:
          dashboardDeletedIndex !== -1
            ? [
                ...state.dashboards.slice(0, dashboardDeletedIndex),
                ...state.dashboards.slice(dashboardDeletedIndex + 1)
              ]
            : [...state.dashboards]
      };
    }

    case DashboardActions.CHANGE_PAGE_ITEMS: {
      return {
        ...state,
        dashboardPerPage: action.payload,
        currentDashboardPage: dashboardHelpers.getCurrentPage(
          state.dashboards,
          state.currentDashboard,
          action.payload
        ),
        dashboardPageNumber: Math.ceil(state.dashboards.length / action.payload)
      };
    }

    case DashboardActions.HIDE_MENU_NOTIFICATION_ICON: {
      const correspondingDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.id
      ]);
      const correspondingDashboardIndex = _.findIndex(
        state.dashboards,
        correspondingDashboard
      );

      return correspondingDashboardIndex !== -1
        ? {
            ...state,
            dashboards: [
              ...state.dashboards.slice(0, correspondingDashboardIndex),
              {
                ...correspondingDashboard,
                details: {
                  ...correspondingDashboard.details,
                  showIcon: false
                }
              },
              ...state.dashboards.slice(correspondingDashboardIndex + 1)
            ]
          }
        : {
            ...state
          };
    }

    case DashboardActions.SEARCH_ITEMS: {
      return {
        ...state,
        dashboardSearchItem: {
          ...state.dashboardSearchItem,
          loading: true,
          loaded: false
        }
      };
    }

    case DashboardActions.UPDATE_SEARCH_RESULT: {
      return {
        ...state,
        dashboardSearchItem: dashboardHelpers.mapStateToDashboardSearchItems(
          state.dashboardSearchItem,
          action.payload
        )
      };
    }

    case DashboardActions.CHANGE_SEARCH_HEADER: {
      const clickedHeader = action.payload.header;

      return {
        ...state,
        dashboardSearchItem: updateWithHeaderSelectionCriterias({
          ...state.dashboardSearchItem,
          headers: state.dashboardSearchItem.headers.map(header => {
            const newHeader: any = { ...header };
            if (newHeader.name === clickedHeader.name) {
              newHeader.selected = clickedHeader.selected;
            }

            if (clickedHeader.name === 'all') {
              if (newHeader.name !== 'all' && clickedHeader.selected) {
                newHeader.selected = false;
              }
            } else {
              if (newHeader.name === 'all' && clickedHeader.selected) {
                newHeader.selected = false;
              }
            }

            if (
              !action.payload.multipleSelection &&
              clickedHeader.name !== newHeader.name
            ) {
              newHeader.selected = false;
            }

            return newHeader;
          })
        })
      };
    }

    case DashboardActions.LOAD_SHARING_DATA:
      return state;

    case DashboardActions.LOAD_SHARING_DATA_SUCCESS:
      return {
        ...state,
        dashboardSharing: {
          ...state.dashboardSharing,
          [action.payload.id]: action.payload
        }
      };

    case DashboardActions.UPDATE_SHARING_DATA: {
      const dashboardSharingToUpdate: DashboardSharing =
        state.dashboardSharing[state.currentDashboard];
      return {
        ...state,
        dashboardSharing: {
          ...state.dashboardSharing,
          [state.currentDashboard]: {
            ...dashboardSharingToUpdate,
            sharingEntity: action.payload
          }
        }
      };
    }

    default:
      return state;
  }
}
