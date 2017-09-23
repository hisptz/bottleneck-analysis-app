import * as _ from 'lodash';
import {INITIAL_STORE_DATA, StoreData} from '../store-data';
import {Visualization} from '../../dashboard/model/visualization';
import * as fromAction from '../actions';
import {Dashboard} from '../../model/dashboard';
import {DashboardSearchItem} from '../../dashboard/model/dashboard-search-item';
import {mapStateToDashboardObject} from '../mappers/map-state-to-dashboard';

export function storeDataReducer(state: StoreData = INITIAL_STORE_DATA, action) {
  switch (action.type) {
    case fromAction.CURRENT_USER_LOADED_ACTION: {
      const newState: StoreData = {...state};
      newState.currentUser = {...action.payload};
      return newState;
    }

    case fromAction.DASHBOARDS_LOADED_ACTION: {
      const newState: StoreData = {...state};

      newState.dashboards = _.map(action.payload, (dashboard: any) => {
        return mapStateToDashboardObject(dashboard)
      });

      return newState;
    }

    case fromAction.CREATE_DASHBOARD_ACTION: {
      const newState: StoreData = {...state};
      newState.dashboards = _.sortBy([...newState.dashboards, mapStateToDashboardObject(action.payload, 'create')], ['name']);
      return newState;
    }

    case fromAction.DASHBOARD_CREATED_ACTION: {
      const newState: StoreData = {...state};
      const createdDashboardIndex = _.findIndex(newState.dashboards, _.find(newState.dashboards, ['id', '0']));

      if (createdDashboardIndex !== -1) {
        newState.dashboards = [
          ...newState.dashboards.slice(0, createdDashboardIndex),
          mapStateToDashboardObject(action.payload, 'created'),
          ...newState.dashboards.slice(createdDashboardIndex + 1)
        ];
      }

      return newState;
    }

    case fromAction.EDIT_DASHBOARD_ACTION: {
      const newState: StoreData = {...state};
      const newDashboards: Dashboard[] = _.clone(newState.dashboards);
      const editedDashboard = _.find(newDashboards, ['id', action.payload.id]);
      if (editedDashboard) {
        const createdDashboardIndex = _.findIndex(newDashboards, editedDashboard);
        editedDashboard.name = action.payload.name;
        newDashboards[createdDashboardIndex] = mapStateToDashboardObject(editedDashboard, 'update');
        newState.dashboards = _.sortBy(newDashboards, ['name']);
      }
      return newState;
    }

    case fromAction.DASHBOARD_EDITED_ACTION: {
      const newState: StoreData = {...state};
      let editedDashboard = null;
      const editError = action.payload.error;
      /**
       * Check for errors
       */
      if (editError) {
        editedDashboard = action.payload.dashboardData;
      } else {
        editedDashboard = action.payload;
      }

      const availableDashboard = _.find(newState.dashboards, ['id', editedDashboard.id]);
      if (availableDashboard) {
        const availableDashboardIndex = _.findIndex(newState.dashboards, availableDashboard);

        /**
         * Update with edit error if occurred
         */
        if (editError) {
          availableDashboard.details.editFailed = true;
          availableDashboard.details.error = editError;
        }

        newState.dashboards = _.sortBy([
          ...newState.dashboards.slice(0, availableDashboardIndex),
          mapStateToDashboardObject(availableDashboard, 'updated'),
          ...newState.dashboards.slice(availableDashboardIndex + 1)
        ], ['name']);
      }
      return newState;
    }

    case fromAction.HIDE_DASHBOARD_MENU_ITEM_NOTIFICATION_ICON: {
      const newState: StoreData = _.clone(state);
      const availableDashboard = _.find(newState.dashboards, ['id', action.payload.id]);

      if (availableDashboard) {
        const availableDashboardIndex = _.findIndex(newState.dashboards, availableDashboard);
        availableDashboard.details.showIcon = false;
        newState.dashboards[availableDashboardIndex] = availableDashboard;
      }
      return newState;
    }

    case fromAction.DELETE_DASHBOARD_ACTION: {
      const newState: StoreData = _.clone(state);
      const newDashboards: Dashboard[] = _.clone(newState.dashboards);
      const dashboardToDelete = _.find(newState.dashboards, ['id', action.payload.id]);
      if (dashboardToDelete) {
        const dashboardToDeleteIndex = _.findIndex(newState.dashboards, dashboardToDelete);
        newState.dashboards[dashboardToDeleteIndex] = mapStateToDashboardObject(dashboardToDelete, 'delete');
      }
      return newState;
    }

    case fromAction.DASHBOARD_DELETED_ACTION: {
      const newState: StoreData = {...state};
      const newDashboards: Dashboard[] = [...newState.dashboards];
      const dashboardToDelete = _.find(newDashboards, ['id', action.payload.id]);
      if (dashboardToDelete) {
        newDashboards.splice(_.findIndex(newState.dashboards, dashboardToDelete), 1);
        newState.dashboards = _.sortBy(newDashboards, ['name']);
      }
      return newState;
    }

    case fromAction.DASHBOARD_NOTIFICATION_LOADED_ACTION: {
      const newState: StoreData = {...state};
      newState.dashboardNotification = {...action.payload};
      return newState;
    }

    case fromAction.INITIAL_VISUALIZATION_OBJECTS_LOADED_ACTION: {
      const newState: StoreData = {...state};
      action.payload.forEach((visualization: Visualization) => {
        newState.visualizationObjects = visualization.details.isNew ?
          [visualization, ...newState.visualizationObjects] :
          [...newState.visualizationObjects, visualization];
      });

      return newState;
    }

    case fromAction.RESIZE_DASHBOARD_ACTION: {
      const newState: StoreData = {...state};
      const visualizationObject = {...action.payload.visualizationObject};
      const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects,
        _.find(newState.visualizationObjects, ['id', visualizationObject.id]));

      if (currentVisualizationObjectIndex !== -1) {
        newState.visualizationObjects = [
          ...newState.visualizationObjects.slice(0, currentVisualizationObjectIndex),
          action.payload.visualizationObject,
          ...newState.visualizationObjects.slice(currentVisualizationObjectIndex + 1)
        ];
      }

      return newState;
    }

    case fromAction.SAVE_VISUALIZATION: {
      const newState: StoreData = {...state};

      const currentVisualization = _.find(newState.visualizationObjects, ['id', action.payload.id]);

      if (currentVisualization) {
        const visualizationIndex = _.findIndex(newState.visualizationObjects, currentVisualization);
        newState.visualizationObjects = [
          ...newState.visualizationObjects.slice(0, visualizationIndex),
          action.payload,
          ...newState.visualizationObjects.slice(visualizationIndex + 1)
        ];
      }

      return newState;
    }

    case fromAction.LOCAL_FILTER_CHANGE_ACTION: {
      const newState: StoreData = {...state};

      const currentVisualization = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);

      if (currentVisualization) {
        const visualizationIndex = _.findIndex(newState.visualizationObjects, currentVisualization);
        const newVisualization: Visualization = {...action.payload.visualizationObject};
        const visualizationDetails: any = {...newVisualization.details};
        visualizationDetails.loaded = false;
        newVisualization.details = {...visualizationDetails};
        newState.visualizationObjects = [
          ...newState.visualizationObjects.slice(0, visualizationIndex),
          newVisualization,
          ...newState.visualizationObjects.slice(visualizationIndex + 1)
        ];
      }

      return newState;
    }

    case fromAction.GLOBAL_FILTER_CHANGE_ACTION: {
      const newState: StoreData = {...state};

      newState.visualizationObjects = _.map(newState.visualizationObjects, (visualization: Visualization) => {
        const newVisualization: Visualization = {...visualization};

        const visualizationDetails: any = {...newVisualization.details};

        if (newVisualization.dashboardId === action.payload.dashboardId) {
          visualizationDetails.loaded = false;
        }

        newVisualization.details = {...visualizationDetails};
        return newVisualization;
      });
      return newState;
    }

    case fromAction.VISUALIZATION_WITH_MAP_SETTINGS_UPDATED: {
      const newState: StoreData = {...state};

      const currentVisualization = _.find(newState.visualizationObjects, ['id', action.payload.id]);
      if (currentVisualization) {
        const visualizationIndex = _.findIndex(newState.visualizationObjects, currentVisualization);
        newState.visualizationObjects = [
          ...newState.visualizationObjects.slice(0, visualizationIndex),
          action.payload,
          ...newState.visualizationObjects.slice(visualizationIndex + 1)
        ];
      }

      return newState;
    }

    case fromAction.FULL_SCREEN_TOGGLE_ACTION: {
      const newState: StoreData = {...state};

      const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, _.find(newState.visualizationObjects, ['id', action.payload.id]));

      if (currentVisualizationObjectIndex !== -1) {
        newState.visualizationObjects = [
          ...newState.visualizationObjects.slice(0, currentVisualizationObjectIndex),
          action.payload,
          ...newState.visualizationObjects.slice(currentVisualizationObjectIndex + 1)
        ];
      }
      return newState;
    }

    case fromAction.LOAD_DASHBOARD_SEARCH_ITEMS_ACTION: {
      const newState = {...state};
      const dashboardSearchItems = _.cloneDeep(newState.dashboardSearchItems);
      dashboardSearchItems.loading = true;
      dashboardSearchItems.loaded = false;
      newState.dashboardSearchItems = dashboardSearchItems;
      return newState;
    }

    case fromAction.DASHBOARD_SEARCH_ITEMS_LOADED_ACTION: {
      const newState = {...state};
      newState.dashboardSearchItems.loading = false;
      newState.dashboardSearchItems.loaded = true;
      return handleIncomingSearchResults(newState, action);
    }

    case fromAction.DASHBOARD_SEARCH_HEADERS_CHANGE_ACTION: {
      const newState = _.clone(state);
      const clickedHeader = action.payload.header;
      const dashboardSearchHeaders: any[] = _.clone(newState.dashboardSearchItems.headers);
      newState.dashboardSearchItems.headers = dashboardSearchHeaders.map(header => {
        const newHeader = _.clone(header);
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

        if (!action.payload.multipleSelection && clickedHeader.name !== newHeader.name) {
          newHeader.selected = false;
        }

        return newHeader;
      });
      newState.dashboardSearchItems = updateWithHeaderSelectionCriterias(newState.dashboardSearchItems);
      return newState;
    }

    case fromAction.DELETE_VISUALIZATION_OBJECT_ACTION: {
      const newState = {...state};
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObjectId]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.deleting = true;
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject;
      }
      return newState;
    }

    case fromAction.VISUALIZATION_OBJECT_DELETED_ACTION: {
      const newState = _.clone(state);
      /**
       * Delete dashboard Item first
       */
      if (action.payload.deleted) {
        const dashboard = _.find(newState.dashboards, ['id', action.payload.dashboardId]);
        if (dashboard) {
          const dashboardIndex = _.findIndex(newState.dashboards, dashboard);
          const dashboardItemIndex = _.findIndex(dashboard.dashboardItems, _.find(dashboard.dashboard, ['id', action.payload.visualizationObjectId]));
          if (dashboardItemIndex !== -1) {
            dashboard.dashboardItems.splice(dashboardItemIndex, 1);

            newState.dashboards[dashboardIndex] = _.clone(dashboard);
          }
        }
      }

      /**
       * Delete visualization Object
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObjectId]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);

        if (action.payload.deleted) {
          newState.visualizationObjects.splice(currentVisualizationObjectIndex, 1);
        } else {
          currentVisualizationObject.details.deleteFail = true;
          currentVisualizationObject.details.deleting = false;
          newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject;
        }
      }
      return newState;
    }

    case fromAction.UPDATE_DASHBOARD_ACTION: {
      const newState: StoreData = {...state};
      const dashboardIndex = _.findIndex(newState.dashboards, _.find(newState.dashboards, ['id', action.payload.id]));

      if (dashboardIndex !== -1) {
        newState.dashboards = [
          ...newState.dashboards.slice(0, dashboardIndex),
          action.payload,
          ...newState.dashboards.slice(dashboardIndex + 1)
        ];
      }
      return newState;
    }

    default:
      return state;
  }
}

export function mapFavoriteToLayerSettings(favoriteObject: any) {
  if (favoriteObject.mapViews) {
    return _.map(favoriteObject.mapViews, (view: any) => {
      return {settings: view}
    });
  }
  return [{settings: favoriteObject}];
}

function handleIncomingSearchResults(state, action) {
  const newState: StoreData = _.clone(state);
  const searchResults = action.payload;
  const newSearchResults: any[] = [];
  if (searchResults !== null) {
    const searchResultKeys = _.keys(searchResults);
    searchResultKeys.forEach(searchResultKey => {
      if (_.isObject(searchResults[searchResultKey])) {
        const resultItems = searchResults[searchResultKey];
        resultItems.forEach(item => {
          switch (searchResultKey) {
            case 'reportTables':
              item.displayType = 'tables';
              item.icon = 'assets/img/table.png';
              item.type = searchResultKey;
              newSearchResults.push(item);
              break;
            case 'eventReports':
              item.displayType = 'tables';
              item.icon = 'assets/img/table.png';
              item.type = searchResultKey;
              newSearchResults.push(item);
              break;
            case 'eventCharts':
              item.displayType = 'charts';
              item.icon = 'assets/img/bar.png';
              item.type = searchResultKey;
              newSearchResults.push(item);
              break;
            default:
              item.icon = 'assets/img/' + searchResultKey.slice(0, -1) + '.png';
              if (searchResultKey === 'charts') {
                item.icon = 'assets/img/bar.png';
              }
              item.displayType = searchResultKey;
              item.type = searchResultKey;
              newSearchResults.push(item);
              break;
          }
        })
      }
    });
  }
  newState.dashboardSearchItems.results = newSearchResults;

  newState.dashboardSearchItems = updateWithHeaderSelectionCriterias(newState.dashboardSearchItems);

  return newState;
}

function updateWithHeaderSelectionCriterias(dashboardSearchItems: DashboardSearchItem) {
  const newDashboardSearchResults = _.clone(dashboardSearchItems.results);

  dashboardSearchItems.results = newDashboardSearchResults.map(result => {
    const newResult = _.clone(result);
    const correspondingHeader = _.find(dashboardSearchItems.headers, ['name', newResult.displayType]);
    const allHeader = _.find(dashboardSearchItems.headers, ['name', 'all']);
    /**
     * Set selection options
     */
    if (correspondingHeader) {
      newResult.selected = allHeader.selected ? true : correspondingHeader.selected;
    }

    return newResult;
  });

  const newDashboardSearchHeaders = _.clone(dashboardSearchItems.headers);

  dashboardSearchItems.headers = newDashboardSearchHeaders.map(header => {
    const newHeader = _.clone(header);

    if (newHeader.name === 'all') {
      newHeader.itemCount = dashboardSearchItems.results.length
    } else {
      newHeader.itemCount = _.filter(dashboardSearchItems.results, (result) => result.displayType === newHeader.name).length;
    }
    return newHeader;
  });

  const selectedHeaderCountArray = dashboardSearchItems.headers.filter((header) => header.selected)
    .map((filteredHeader) => filteredHeader.itemCount);
  dashboardSearchItems.resultCount = selectedHeaderCountArray.length > 0 ?
    selectedHeaderCountArray.reduce((sum: number, count: number) => sum + count) : 0;

  return dashboardSearchItems;
}
