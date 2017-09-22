import * as _ from 'lodash';
import {INITIAL_STORE_DATA, StoreData} from '../store-data';
import {Visualization} from '../../dashboard/model/visualization';
import {
  CURRENT_VISUALIZATION_CHANGE_ACTION, DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION, DASHBOARD_SEARCH_ITEMS_LOADED_ACTION,
  DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION, FAVORITE_OPTIONS_LOADED_ACTION,
  SAVE_TABLE_CONFIGURATION_ACTION, SAVE_TABLE_OBJECT_ACTION, VISUALIZATION_OBJECT_MERGED_ACTION,
  VISUALIZATION_OBJECT_SPLITED_ACTION, VISUALIZATION_OBJECT_DELETED_ACTION,
  DELETE_VISUALIZATION_OBJECT_ACTION, DASHBOARDS_LOADED_ACTION, DELETE_DASHBOARD_ACTION,
  CURRENT_USER_LOADED_ACTION, CREATE_DASHBOARD_ACTION, DASHBOARD_CREATED_ACTION, EDIT_DASHBOARD_ACTION,
  DASHBOARD_EDITED_ACTION, ANALYTICS_LOADED_ACTION,
  VISUALIZATION_OBJECT_OPTIMIZED_ACTION,
  LOAD_DASHBOARD_SEARCH_ITEMS_ACTION, DASHBOARD_SEARCH_HEADERS_CHANGE_ACTION, DASHBOARD_DELETED_ACTION,
  HIDE_DASHBOARD_MENU_ITEM_NOTIFICATION_ICON, GEO_FEATURE_LOADED_ACTION, SAVE_CHART_CONFIGURATION_ACTION,
  SAVE_CHART_OBJECT_ACTION, UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION,
  UPDATE_VISUALIZATION_OBJECT_WITH_RENDERING_OBJECT_ACTION,
  UPDATE_VISUALIZATION_WITH_FILTER_ACTION, UPDATE_VISUALIZATION_WITH_INTERPRETATION_ACTION
} from '../actions';
import * as fromAction from '../actions';
import {Dashboard} from '../../model/dashboard';
import {DashboardSearchItem} from '../../dashboard/model/dashboard-search-item';
import {mapStateToDashboardObject} from '../mappers/map-state-to-dashboard';
import {replaceArrayItem} from '../../utilities/replaceArrayItem';
import {addArrayItem} from '../../utilities/addArrayItem';

export function storeDataReducer(state: StoreData = INITIAL_STORE_DATA, action) {
  switch (action.type) {
    case CURRENT_USER_LOADED_ACTION: {
      const newState: StoreData = _.clone(state);
      newState.currentUser = action.payload;
      return newState;
    }

    case DASHBOARDS_LOADED_ACTION: {
      const newState: StoreData = _.clone(state);

      newState.dashboards = _.map(action.payload, (dashboard: any) => {
        return mapStateToDashboardObject(dashboard)
      });

      return newState;
    }

    case CREATE_DASHBOARD_ACTION: {
      const newState: StoreData = _.clone(state);
      const newDashboards: Dashboard[] = _.clone(newState.dashboards);
      newDashboards.push(mapStateToDashboardObject(action.payload.dashboardData, 'create'));
      newState.dashboards = _.sortBy(newDashboards, ['name']);
      return newState;
    }

    case DASHBOARD_CREATED_ACTION: {
      const newState: StoreData = _.clone(state);
      const newDashboards: Dashboard[] = _.clone(newState.dashboards);
      const createdDashboard = _.find(newDashboards, ['id', '0']);
      if (createdDashboard) {
        const createdDashboardIndex = _.findIndex(newDashboards, createdDashboard);
        newDashboards[createdDashboardIndex] = mapStateToDashboardObject(action.payload, 'created')
        newState.dashboards = newDashboards;
      }
      return newState;
    }

    case EDIT_DASHBOARD_ACTION: {
      const newState: StoreData = _.clone(state);
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

    case CURRENT_VISUALIZATION_CHANGE_ACTION: {
      const newState: StoreData = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);

      if (currentVisualizationObject) {
        const visualizationDetails = _.clone(currentVisualizationObject.details);
        const newVisualizationObject = _.clone(currentVisualizationObject);

        visualizationDetails.loaded = false;
        visualizationDetails.currentVisualization = action.payload.selectedVisualization;

        newVisualizationObject.details = _.assign({}, visualizationDetails);

        newState.visualizationObjects = replaceArrayItem(
          newState.visualizationObjects,
          {id: action.payload.visualizationObject.id},
          newVisualizationObject
        )
      }
      return newState;
    }

    case DASHBOARD_EDITED_ACTION: {
      const newState: StoreData = _.clone(state);
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

        newState.dashboards[availableDashboardIndex] = mapStateToDashboardObject(availableDashboard, 'updated');
        newState.dashboards = _.sortBy(newState.dashboards, ['name']);
      }
      return newState;
    }

    case HIDE_DASHBOARD_MENU_ITEM_NOTIFICATION_ICON: {
      const newState: StoreData = _.clone(state);
      const availableDashboard = _.find(newState.dashboards, ['id', action.payload.id]);

      if (availableDashboard) {
        const availableDashboardIndex = _.findIndex(newState.dashboards, availableDashboard);
        availableDashboard.details.showIcon = false;
        newState.dashboards[availableDashboardIndex] = availableDashboard;
      }
      return newState;
    }

    case DELETE_DASHBOARD_ACTION: {
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

    case 'DASHBOARD_NOTIFICATION_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.dashboardNotification = action.payload;
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

    case fromAction.FAVORITE_LOADED_ACTION: {
      const newState: StoreData = _.clone(state);
      const favorite = action.payload.favorite;

      if (favorite) {
        /**
         * Save favorite with its option
         */
        const currentFavorite = _.find(newState.favorites, ['id', action.payload.favorite.id]);
        if (!currentFavorite && action.payload.favorite !== {}) {
          newState.favorites = [...newState.favorites, action.payload.favorite];
        }
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

    case fromAction.GLOBAL_FILTER_CHANGE_ACTION: {
      const newState: StoreData = {...state};

      newState.visualizationObjects = _.map(newState.visualizationObjects, (visualization: Visualization) => {
        const newVisualization: Visualization = {...visualization};

        if (newVisualization.dashboardId === action.payload.dashboardId) {
          newVisualization.details.loaded = false;
        }

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

    case UPDATE_VISUALIZATION_WITH_FILTER_ACTION: {
      return handleFiltersUpdateAction(state, action)
    }

    case UPDATE_VISUALIZATION_WITH_INTERPRETATION_ACTION: {
      return handleInterpretationUpdateAction(state, action);
    }

    case UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION: {
      return handleFiltersUpdateAction(state, action)
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

    case ANALYTICS_LOADED_ACTION: {
      return handleAnalyticsLoadedAction(state, action);
      // return updateVisualizationWithAnalytics(newState, action)
    }

    case SAVE_CHART_CONFIGURATION_ACTION: {
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

    case SAVE_TABLE_CONFIGURATION_ACTION: {
      const newState: StoreData = _.clone(state);
      /**
       * Update visualization object with table configuration
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObjectId]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.layers.forEach((layer: any) => {
          const tableConfigurationObject = _.find(action.payload.tableConfigurations, ['id', layer.settings.id]);
          if (tableConfigurationObject) {
            layer.settings.tableConfiguration = tableConfigurationObject.content;
          }
        });
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject
      }
      return newState;
    }


    case 'SAVE_MAP_CONFIGURATION_ACTION': {
      const newState: StoreData = _.clone(state);
      /**
       * Update visualization object with map configuration
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.mapConfiguration = action.payload.mapConfiguration;
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject
      }
      return newState;
    }

    case SAVE_CHART_OBJECT_ACTION: {
      const newState = _.clone(state);
      const loadedVisualizationObject: Visualization = _.clone(action.payload.visualizationObject);
      /**
       * Update visualization object chart Object
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', loadedVisualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        const newVisualizationObject = _.cloneDeep(currentVisualizationObject);

        const visualizationObjectDetails = _.cloneDeep(currentVisualizationObject.details);
        visualizationObjectDetails.loaded = true;

        const visualizationObjectLayers = currentVisualizationObject.layers.map((layer: any) => {
          const newLayer = _.clone(layer);
          const chartObject = _.find(action.payload.chartObjects, ['id', newLayer.settings.id]);
          if (chartObject) {
            newLayer.chartObject = Object.assign({}, chartObject.content);
          }
          return newLayer;
        });

        newVisualizationObject.details = Object.assign({}, visualizationObjectDetails);
        newVisualizationObject.layers = Object.assign([], visualizationObjectLayers);

        newState.visualizationObjects = [
          ...newState.visualizationObjects.slice(0, currentVisualizationObjectIndex),
          newVisualizationObject,
          ...newState.visualizationObjects.slice(currentVisualizationObjectIndex + 1)
        ];
      }
      return newState;
    }

    case SAVE_TABLE_OBJECT_ACTION: {
      const newState = _.clone(state);
      const loadedVisualizationObject: Visualization = _.clone(action.payload.visualizationObject)
      /**
       * Update visualization object chart Object
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', loadedVisualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        const newVisualizationObject = _.cloneDeep(currentVisualizationObject);

        const visualizationObjectDetails = _.cloneDeep(currentVisualizationObject.details);
        visualizationObjectDetails.loaded = true;

        const visualizationObjectLayers = currentVisualizationObject.layers.map((layer: any) => {
          const newLayer = _.clone(layer);
          const tableObject = _.find(action.payload.tableObjects, ['id', newLayer.settings.id]);
          if (tableObject) {
            newLayer.tableObject = Object.assign({}, tableObject.content);
          }
          return newLayer;
        });

        newVisualizationObject.details = Object.assign({}, visualizationObjectDetails);
        newVisualizationObject.layers = Object.assign([], visualizationObjectLayers);

        newState.visualizationObjects = [
          ...newState.visualizationObjects.slice(0, currentVisualizationObjectIndex),
          newVisualizationObject,
          ...newState.visualizationObjects.slice(currentVisualizationObjectIndex + 1)
        ];
      }
      return newState;
    }

    case GEO_FEATURE_LOADED_ACTION: {
      const newState = _.clone(state);
      /**
       * Save geoFeatures
       */
      action.payload.geoFeatures.forEach(geoFeature => {
        const currentGeoFeature = _.find(newState.geoFeatures, ['id', geoFeature.id]);
        if (!currentGeoFeature && geoFeature.content.length > 0) {
          newState.geoFeatures.push(geoFeature);
        } else {
          const currentGeoFeatureIndex = _.findIndex(newState.geoFeatures, currentGeoFeature);
          newState.geoFeatures[currentGeoFeatureIndex] = geoFeature;
        }
      });

      /**
       * update visualization with geoFeatures
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.layers.forEach((layer: any) => {
          const geoFeature = _.find(newState.geoFeatures, ['id', layer.settings.id]);
          if (geoFeature) {
            layer.settings.geoFeature = geoFeature.content;
          }
        });
        currentVisualizationObject.details.geoFeatureLoaded = true;
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject;
      }
      return newState;
    }

    case 'LEGEND_SET_LOADED_ACTION': {
      const newState = _.clone(state);

      /**
       * save legend sets
       */
      action.payload.legendSets.forEach(legendSet => {
        if (legendSet !== null) {
          const currentLegendSet = _.find(newState.legendSets, ['id', legendSet.id]);
          if (!currentLegendSet) {
            newState.legendSets.push(legendSet);
          } else {
            const currentLegendSetIndex = _.findIndex(newState.legendSets, currentLegendSet);
            newState.legendSets[currentLegendSetIndex] = legendSet;
          }
        }
      });

      /**
       * update visualization with legend set
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.layers.forEach((layer: any) => {
          if (layer.settings.legendSet) {
            const legendSet = _.find(newState.legendSets, ['id', layer.settings.legendSet.id]);
            if (legendSet) {
              layer.settings.legendSet = legendSet;
            }
          }
        });
        currentVisualizationObject.details.legendSetLoaded = true;
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject;
      }
      return newState;
    }

    case 'FAVORITE_SAVED_ACTION': {
      const newState = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.updateAvailable = false;
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject;
      }
      return newState;
    }

    case 'GLOBAL_FILTER_UPDATE_ACTION': {
      const newState = _.clone(state);
      const currentVisualizationObjects = _.filter(newState.visualizationObjects, ['dashboardId', action.payload.dashboardId]);
      currentVisualizationObjects.forEach(visualizationObject => {
        const newVisualizationObject = _.clone(visualizationObject);
        const visualizationObjectIndex = _.findIndex(newState.visualizationObjects, visualizationObject);

        newVisualizationObject.details.filters.forEach(filterObject => {
          filterObject.filters.forEach(filter => {
            if (action.payload.filterValue.name === filter.name) {
              filter.value = action.payload.value;
            }
          })
        });

        if (newVisualizationObject.details.filters.length > 0) {
          newVisualizationObject.details.loaded = false;
          newVisualizationObject.details.analyticsLoaded = false;
          newState.visualizationObjects[visualizationObjectIndex] = newVisualizationObject;
        }
      });
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

    case FAVORITE_OPTIONS_LOADED_ACTION: {
      const newState = _.clone(state);
      newState.favoriteOptions = _.assign([], action.payload);
      return newState;
    }

    case DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION: {
      const newState = _.clone(state);
      newState.customDashboardSettings = _.assign({}, action.payload);
      return newState;
    }

    case DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION: {
      const newState = _.clone(state);
      newState.customDashboardSettings = _.assign({}, action.payload.dashboardGroupSettings);
      return newState;
    }

    case VISUALIZATION_OBJECT_MERGED_ACTION: {
      const newState = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.id]);
      if (currentVisualizationObject) {
        const newVisualizationObject: Visualization = _.clone(currentVisualizationObject);
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);

        /**
         * Copy visualization details to new variable
         */
        const visualizationObjectDetails = _.cloneDeep(currentVisualizationObject.details);

        visualizationObjectDetails.visualizationOptimized = true;
        visualizationObjectDetails.merged = true;

        /**
         * Copy layer to the new variable
         */
        const newVisualizationLayers = _.cloneDeep(action.payload.layers);

        /**
         * Copy details and layer to the new visualization Object
         */
        newVisualizationObject.details = Object.assign({}, visualizationObjectDetails);
        newVisualizationObject.layers = Object.assign([], newVisualizationLayers);

        newState.visualizationObjects = [
          ...newState.visualizationObjects.slice(0, currentVisualizationObjectIndex),
          newVisualizationObject,
          ...newState.visualizationObjects.slice(currentVisualizationObjectIndex + 1)
        ];
      }
      return newState;
    }

    case VISUALIZATION_OBJECT_SPLITED_ACTION: {
      const newState = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.visualizationOptimized = true;
        currentVisualizationObject.details.splited = true;
        currentVisualizationObject.layers = action.payload.layers;
        newState.visualizationObjects[currentVisualizationObjectIndex] = _.cloneDeep(currentVisualizationObject);
      }
      // console.log(newState.visualizationObjects);
      return newState;
    }

    case LOAD_DASHBOARD_SEARCH_ITEMS_ACTION: {
      const newState = _.clone(state);
      const dashboardSearchItems = _.cloneDeep(newState.dashboardSearchItems);
      dashboardSearchItems.loading = true;
      dashboardSearchItems.loaded = false;
      newState.dashboardSearchItems = dashboardSearchItems;
      return newState;
    }

    case DASHBOARD_SEARCH_ITEMS_LOADED_ACTION: {
      const newState = _.clone(state);
      newState.dashboardSearchItems.loading = false;
      newState.dashboardSearchItems.loaded = true;
      return handleIncomingSearchResults(newState, action);
    }

    case DASHBOARD_SEARCH_HEADERS_CHANGE_ACTION: {
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

    case DELETE_VISUALIZATION_OBJECT_ACTION: {
      const newState = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObjectId]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.deleting = true;
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject;
      }
      return newState;
    }

    case VISUALIZATION_OBJECT_DELETED_ACTION: {
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

    case VISUALIZATION_OBJECT_OPTIMIZED_ACTION: {
      const newState = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.visualizationOptimized = true;
        newState.visualizationObjects[currentVisualizationObjectIndex] = currentVisualizationObject;
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

    case UPDATE_VISUALIZATION_OBJECT_WITH_RENDERING_OBJECT_ACTION: {
      const newState = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.id]);
      if (currentVisualizationObject) {
        const newVisualizationObject = _.clone(currentVisualizationObject);

        const visualizationObjectDetails = _.clone(action.payload.details);
        visualizationObjectDetails.loaded = true;
        newVisualizationObject.details = _.assign({}, visualizationObjectDetails);

        const visualizationLayers = _.clone(action.payload.layers);
        newVisualizationObject.layers = _.assign([], visualizationLayers);

        newState.visualizationObjects = replaceArrayItem(
          newState.visualizationObjects,
          {id: currentVisualizationObject.id},
          newVisualizationObject
        )
      }
      return newState;
    }

    default:
      return state;
  }
}

function mapPayloadToDashboardGroupSettings(payload) {
  return {
    useDashboardGroups: true,
    dashboardGroups: []
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

function handleFiltersUpdateAction(state: StoreData, action: any) {
  const newState: StoreData = _.clone(state);
  const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
  if (currentVisualizationObject) {
    const newVisualizationObject = _.clone(currentVisualizationObject);

    const visualizationDetails = _.clone(currentVisualizationObject.details);
    visualizationDetails.filters = action.payload.filters;
    visualizationDetails.loaded = false;

    if (action.payload.updateAvailable) {
      visualizationDetails.updateAvailable = true;
    }

    newVisualizationObject.details = _.assign({}, visualizationDetails);

    newState.visualizationObjects = replaceArrayItem(
      newState.visualizationObjects,
      {id: currentVisualizationObject.id},
      newVisualizationObject
    );
  }
  return newState;
}

function handleInterpretationUpdateAction(state: StoreData, action: any) {
  const newState: StoreData = _.clone(state);
  const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
  if (currentVisualizationObject) {
    const newVisualizationObject = _.clone(currentVisualizationObject);

    const visualizationDetails = _.clone(currentVisualizationObject.details);
    visualizationDetails.interpretations = action.payload.interpretations;
    visualizationDetails.loaded = false;

    if (action.payload.updateAvailable) {
      visualizationDetails.updateAvailable = true;
    }

    newVisualizationObject.details = _.assign({}, visualizationDetails);

    newState.visualizationObjects = replaceArrayItem(
      newState.visualizationObjects,
      {id: currentVisualizationObject.id},
      newVisualizationObject
    );
  }
  return newState;
}

function handleAnalyticsLoadedAction(state: StoreData, action: any) {
  const newState = _.clone(state);
  const loadedAnalytics = action.payload.analytics;

  if (loadedAnalytics) {
    loadedAnalytics.forEach(analytics => {
      newState.analytics = addArrayItem(newState.analytics, analytics, 'id', 'last', true);
    })
  }
  return newState;
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
