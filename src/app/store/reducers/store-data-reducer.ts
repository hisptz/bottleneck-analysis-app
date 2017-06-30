import * as _ from 'lodash';
import {INITIAL_STORE_DATA, StoreData} from '../store-data';
import {Visualization} from '../../dashboard/model/visualization';
export function storeDataReducer(state: StoreData = INITIAL_STORE_DATA, action) {
  switch (action.type) {
    case 'CURRENT_USER_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.currentUser = action.payload;
      return newState;
    }

    case 'DASHBOARDS_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.dashboards = action.payload.map(dashboard => mapStateToDashboardObject(dashboard));
      return newState;
    }

    case 'CREATE_DASHBOARD_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.dashboards.unshift(mapStateToDashboardObject(action.payload.dashboardData, 'create'));
      return newState;
    }

    case 'DASHBOARD_CREATED_ACTION': {
      const newState: StoreData = _.clone(state);
      const createdDashboard = _.find(newState.dashboards, ['id', '0']);
      if (createdDashboard) {
        const createdDashboardIndex = _.findIndex(newState.dashboards, createdDashboard);
        newState.dashboards[createdDashboardIndex] = mapStateToDashboardObject(action.payload, 'created')
      }
      return newState;
    }

    case 'EDIT_DASHBOARD_ACTION': {
      const newState: StoreData = _.clone(state);
      const editedDashboard = _.find(newState.dashboards, ['id', action.payload.dashboardData.id]);
      if (editedDashboard) {
        const createdDashboardIndex = _.findIndex(newState.dashboards, editedDashboard);
        newState.dashboards[createdDashboardIndex] = mapStateToDashboardObject(action.payload.dashboardData, 'update')
      }
      return newState;
    }

    case 'DASHBOARD_EDITED_ACTION': {
      const newState: StoreData = _.clone(state);
      const editedDashboard = _.find(newState.dashboards, ['id', action.payload.id]);
      if (editedDashboard) {
        const createdDashboardIndex = _.findIndex(newState.dashboards, editedDashboard);
        newState.dashboards[createdDashboardIndex] = mapStateToDashboardObject(action.payload, 'updated')
      }
      return newState;
    }

    case 'DELETE_DASHBOARD_ACTION': {
      const newState: StoreData = _.clone(state);
      const dashboardToDelete = _.find(newState.dashboards, ['id', action.payload.id]);
      if (dashboardToDelete) {
        newState.dashboards.splice(_.findIndex(newState.dashboards, dashboardToDelete), 1)
      }
      return newState;
    }

    case 'DASHBOARD_NOTIFICATION_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.dashboardNotification = action.payload;
      return newState;
    }

    case 'INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.visualizationObjects.push(action.payload.visualizationObject);
      const currentDashboard = _.find(newState.dashboards, ['id', action.payload.visualizationObject.dashboardId]);
      if (currentDashboard) {
        const currentDashboardIndex = _.findIndex(newState.dashboards, currentDashboard);
        const currentDashboardItem = _.find(currentDashboard.dashboardItems, ['id', action.payload.visualizationObject.id]);
        if (currentDashboardItem)  {
          const currentDashboardItemIndex = _.findIndex(currentDashboard.dashboardItems, currentDashboardItem);
          currentDashboardItem.visualizationObjectLoaded = true;
          currentDashboard.dashboardItems[currentDashboardItemIndex] = _.clone(currentDashboardItem);
          newState.dashboards[currentDashboardIndex] = _.clone(currentDashboard);
        }
      }
      return newState;
    }

    case 'RESIZE_DASHBOARD_ACTION': {
      const newState: StoreData = _.clone(state);
      //TODO handle persistance
      return newState;
    }

    case 'FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);

      /**
       * Save favorite with its option
       */
      const currentFavorite = _.find(newState.favorites, ['id', action.payload.favorite.id]);
      if (!currentFavorite && action.payload.favorite !== {}) {
        newState.favorites.push(action.payload.favorite);
      }

      /**
       * Update visualizationObject with filters
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.layers = mapFavoriteToLayerSettings(action.payload.favorite);
        newState.visualizationObjects[currentVisualizationObjectIndex] = _.clone(currentVisualizationObject);
      }
      return newState;
    }

    case 'UPDATE_VISUALIZATION_WITH_FILTER_ACTION': {
      handleFiltersUpdateAction(state, action)
    }

    case 'UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION': {
      handleFiltersUpdateAction(state, action)
    }

    case 'UPDATE_VISUALIZATION_WITH_LAYOUT_ACTION': {
      const newState: StoreData = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.layouts = action.payload.layouts;
        newState.visualizationObjects[currentVisualizationObjectIndex] = _.clone(currentVisualizationObject);
      }
      return newState;
    }

    case 'ANALYTICS_LOADED_ACTION': {
      return handleAnalyticsLoadedAction(state, action)
    }

    case 'SAVE_CHART_CONFIGURATION_ACTION': {
      const newState: StoreData = _.clone(state);

      /**
       * Save chart configuration
       */
      action.payload.chartConfigurations.forEach(chartConfigurationObject => {
        const availableChartConfiguration = _.find(newState.chartConfigurations, ['id', chartConfigurationObject.id]);
        if (!availableChartConfiguration) {
          newState.chartConfigurations.push(chartConfigurationObject);
        } else {
          const availableChartConfigurationIndex = _.findIndex(newState.chartConfigurations, availableChartConfiguration);
          newState.chartConfigurations[availableChartConfigurationIndex] = chartConfigurationObject;
        }
      });

      /**
       * Update visualization object with chart configuration
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObjectId]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.layers.forEach((layer: any) => {
          const chartConfigurationObject = _.find(state.chartConfigurations, ['id', layer.settings.id]);
          if (chartConfigurationObject) {
            layer.settings.chartConfiguration = chartConfigurationObject.chartConfiguration;
          }
        });
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject
      }

      return newState;
    }

    case 'SAVE_CHART_OBJECT_ACTION': {
      const newState: StoreData = _.clone(state);

      /**
       * Save chart objects
       */
      action.payload.chartObjects.forEach(chartObject => {
        const availableChartObject = _.find(newState.chartObjects, ['id', chartObject.id]);
        if (!availableChartObject) {
          newState.chartObjects.push(chartObject);
        } else {
          const availableChartObjectIndex = _.findIndex(newState.chartObjects, availableChartObject);
          newState.chartObjects[availableChartObjectIndex] = chartObject;
        }
      });

      /**
       * Update visualization object chart Object
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.loaded = true;
        currentVisualizationObject.layers.forEach((layer: any) => {
          const chartObject = _.find(state.chartObjects, ['id', layer.settings.id]);
          if (chartObject) {
            layer.chartObject = chartObject.content;
          }
        });
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject;
      }
      return newState;
    }

    default:
      return state;
  }
}

function mapFavoriteToLayerSettings(favoriteObject: any) {
  const layers: any[] = [];
  if (favoriteObject.mapViews) {
    favoriteObject.mapViews.forEach((view: any) => {
      layers.push({settings: view})
    })
  } else {
    layers.push({settings: favoriteObject})
  }
  return layers;
}

function mapStateToDashboardObject(dashboardData: any, action = null) {
  switch (action) {
    case 'create': {
      return {
        id: '0',
        details: {
          isNew: true,
          creationComplete: false,
          showName: false
        },
        name: dashboardData.name,
        dashboardItems: []
      }
    }

    case 'created': {
      return {
        id: dashboardData.id,
        details: {
          isNew: true,
          creationComplete: true,
          showName: true
        },
        name: dashboardData.name,
        dashboardItems: dashboardData.dashboardItems
      }
    }

    case 'update': {
      return {
        id: dashboardData.id,
        details: {
          edited: true,
          editComplete: false,
          showName: false
        },
        name: dashboardData.name,
        dashboardItems: dashboardData.dashboardItems
      }
    }

    case 'updated': {
      return {
        id: dashboardData.id,
        details: {
          edited: true,
          editComplete: true,
          showName: true
        },
        name: dashboardData.name,
        dashboardItems: dashboardData.dashboardItems
      }
    }

    default: {
      dashboardData.details = {
        showName: true
      };
      return dashboardData;
    }
  }

}

function handleVisualizationObjectLoadedAction(state: StoreData, action: any) {
  const newState: StoreData = _.clone(state);
  const visualizationObject: Visualization = action.payload.visualizationObject;
  const currentDashboard: any = _.find(newState.dashboards, ['id', visualizationObject.dashboardId]);
  const currentDashboardIndex: number = _.findIndex(newState.dashboards, currentDashboard);
  if (currentDashboard) {
    currentDashboard.dashboardItems.forEach((dashboardItem: any) => {
      if (dashboardItem.id === visualizationObject.id) {
        dashboardItem.visualizationObject = _.clone(visualizationObject);
      }
    });
    newState.dashboards[currentDashboardIndex] = _.clone(currentDashboard);
  }
  return newState;
}

function handleFiltersUpdateAction(state: StoreData, action: any) {
  const newState: StoreData = _.clone(state);
  const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
  if (currentVisualizationObject) {
    const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
    currentVisualizationObject.details.filters = action.payload.filters;
    currentVisualizationObject.details.loaded = false;
    currentVisualizationObject.details.analyticsLoaded = false;
    newState.visualizationObjects[currentVisualizationObjectIndex] = _.clone(currentVisualizationObject);
  }
  return newState;
}

function handleAnalyticsLoadedAction(state: StoreData, action: any) {
  const newState: StoreData = _.clone(state);
  const favorite = action.payload.favorite;
  /**
   * Save Analytics action
   */
  if (favorite) {
    if (favorite.mapViews) {
      favorite.mapViews.forEach((viewItem, viewIndex) => {
        const analytics = _.find(newState.analytics, ['id', viewItem.id]);

        if (!analytics) {
          if (action.payload.analytics.length > 0 && action.payload.analytics[viewIndex]) {
            newState.analytics.push({id: viewItem.id, analytics: action.payload.analytics[viewIndex]})
          }
        } else {
          const analyticsIndex = _.findIndex(newState.analytics, analytics);
          const newAnalytics = action.payload.analytics[viewIndex];
          newState.analytics[analyticsIndex] = newAnalytics;
        }
      })
    } else {
      const analytics = _.find(newState.analytics, ['id', favorite.id]);
      if (!analytics) {
        if (action.payload.analytics.length > 0 && action.payload.analytics[0]) {
          newState.analytics.push({id: favorite.id, analytics: action.payload.analytics[0]})
        }
      } else {
        const analyticsIndex = _.findIndex(newState.analytics, analytics);
        const newAnalytics = action.payload.analytics[0];
        newState.analytics[analyticsIndex] = newAnalytics;
      }
    }
  } else {
    const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
    if (currentVisualizationObject) {

      const settingsIds = currentVisualizationObject.layers.map(layer => { return layer.settings.id });
      settingsIds.forEach((settingId: any, settingIndex: number) => {
        const analytics = _.find(newState.analytics, ['id', settingId]);
        if (!analytics) {
          if (action.payload.analytics.length > 0 && action.payload.analytics[0]) {
            newState.analytics.push({id: settingId, analytics: action.payload.analytics[settingIndex]})
          }
        } else {
          const analyticsIndex = _.findIndex(newState.analytics, analytics);
          const newAnalytics = _.clone(analytics);
          newAnalytics.analytics = action.payload.analytics[settingIndex];
          newState.analytics[analyticsIndex] = newAnalytics;
        }
      })
    }
  }

  /**
   * Update visualizationObject with analytics
   */
  const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
  if (currentVisualizationObject) {
    const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
    currentVisualizationObject.layers.forEach((layer: any) => {
      const analyticsObject = _.find(state.analytics, ['id', layer.settings.id]);
      if (analyticsObject) {
        currentVisualizationObject.details.analyticsLoaded = true;
        layer.analytics = analyticsObject.analytics;
      }
    });
    newState.visualizationObjects[currentVisualizationObjectIndex] = _.clone(currentVisualizationObject);
  }
  return newState;
}

