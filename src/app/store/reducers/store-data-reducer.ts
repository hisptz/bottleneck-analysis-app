import * as _ from 'lodash';
import {INITIAL_STORE_DATA, StoreData} from '../store-data';
import {Visualization} from '../../dashboard/model/visualization';
import {
  CURRENT_VISUALIZATION_CHANGE_ACTION, DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION, DASHBOARD_SEARCH_ITEMS_LOADED_ACTION,
  DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION, FAVORITE_OPTIONS_LOADED_ACTION, INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION,
  RESIZE_DASHBOARD_ACTION,
  SAVE_TABLE_CONFIGURATION_ACTION, SAVE_TABLE_OBJECT_ACTION, VISUALIZATION_OBJECT_MERGED_ACTION,
  VISUALIZATION_OBJECT_SPLITED_ACTION, FAVORITE_LOADED_ACTION, VISUALIZATION_OBJECT_DELETED_ACTION,
  DELETE_VISUALIZATION_OBJECT_ACTION, DASHBOARDS_LOADED_ACTION, DASHBOARD_ITEM_ADDED_ACTION, DELETE_DASHBOARD_ACTION,
  CURRENT_USER_LOADED_ACTION, CREATE_DASHBOARD_ACTION, DASHBOARD_CREATED_ACTION, EDIT_DASHBOARD_ACTION,
  DASHBOARD_EDITED_ACTION, CHART_TYPE_CHANGE_ACTION, ANALYTICS_LOADED_ACTION, FULL_SCREEN_TOGGLE_ACTION,
  VISUALIZATION_OBJECT_OPTIMIZED_ACTION,
  LOAD_DASHBOARD_SEARCH_ITEMS_ACTION, DASHBOARD_SEARCH_HEADERS_CHANGE_ACTION, DASHBOARD_DELETED_ACTION,
  HIDE_DASHBOARD_MENU_ITEM_NOTIFICATION_ICON, GEO_FEATURE_LOADED_ACTION, SAVE_CHART_CONFIGURATION_ACTION,
  SAVE_CHART_OBJECT_ACTION, UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION,
  UPDATE_VISUALIZATION_OBJECT_WITH_RENDERING_OBJECT_ACTION
} from '../actions';
import {Dashboard} from '../../model/dashboard';
import {DashboardSearchItem} from '../../dashboard/model/dashboard-search-item';
import {mapStateToDashboardObject, mergeRelatedItems} from '../mappers/map-state-to-dashboard';
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
      const loadedDashboards = action.payload.slice();
      newState.dashboards = loadedDashboards.map(dashboard => {
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

    case DASHBOARD_DELETED_ACTION: {
      const newState: StoreData = _.clone(state);
      const newDashboards: Dashboard[] = _.clone(newState.dashboards);
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

    case INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION: {
      const newState: StoreData = _.clone(state);
      const visualizationObject: Visualization = _.clone(action.payload.visualizationObject);

      /**
       * Update for non visualizable items
       */
      const favorite = visualizationObject.details.favorite;
      if (!favorite.id) {
        visualizationObject.details.loaded = true;
      }

      /**
       * Persist visualization object
       */
      if (visualizationObject.details.isNew) {
        visualizationObject.details.isNew = false;
        newState.visualizationObjects = addArrayItem(
          newState.visualizationObjects,
          visualizationObject,
          'id',
          'first'
        );
      } else {
        newState.visualizationObjects = addArrayItem(
          newState.visualizationObjects,
          visualizationObject,
          'id'
        );
      }


      /**
       * Update current dashboard
       */
      const currentDashboard = _.find(newState.dashboards, ['id', visualizationObject.dashboardId]);
      if (currentDashboard) {
        const currentDashboardIndex = _.findIndex(newState.dashboards, currentDashboard);
        const currentDashboardItem = _.find(currentDashboard.dashboardItems, ['id', visualizationObject.id]);
        if (currentDashboardItem) {
          const currentDashboardItemIndex = _.findIndex(currentDashboard.dashboardItems, currentDashboardItem);
          currentDashboardItem.visualizationObjectLoaded = true;
          currentDashboard.dashboardItems[currentDashboardItemIndex] = _.clone(currentDashboardItem);
          newState.dashboards[currentDashboardIndex] = _.clone(currentDashboard);
        }
      }
      return newState;
    }

    case RESIZE_DASHBOARD_ACTION: {
      const newState: StoreData = _.clone(state);

      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.shape = action.payload.shape;
        newState.visualizationObjects[currentVisualizationObjectIndex] = _.clone(currentVisualizationObject);
      }
      return newState;
    }

    case FAVORITE_LOADED_ACTION: {
      const newState: StoreData = _.clone(state);
      const favorite = action.payload.favorite;

      if (favorite) {
        /**
         * By-pass favorite saving if no favorite
         */
        if (!action.payload.favorite.id) {
          return newState;
        }
        /**
         * Save favorite with its option
         */
        const currentFavorite = _.find(newState.favorites, ['id', action.payload.favorite.id]);
        if (!currentFavorite && action.payload.favorite !== {}) {
          newState.favorites.push(action.payload.favorite);
        }
      }

      /**
       * Update visualizationObject with favorite and additional options
       */
      return handleFavoriteUpdateAction(newState, action);
    }

    case 'UPDATE_VISUALIZATION_WITH_FILTER_ACTION': {
      return handleFiltersUpdateAction(state, action)
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

    case 'ORGUNIT_GROUP_SET_LOADED_ACTION': {
      const newState = _.clone(state);

      /**
       * save group sets
       */
      action.payload.groupSets.forEach(groupSet => {
        if (groupSet !== null) {
          const currentGroupSet = _.find(newState.orgUnitGroupSets, ['id', groupSet.id]);
          if (!currentGroupSet) {
            newState.orgUnitGroupSets.push(groupSet);
          } else {
            const currentGroupSetIndex = _.findIndex(newState.legendSets, currentGroupSet);
            newState.orgUnitGroupSets[currentGroupSetIndex] = groupSet;
          }
        }
      });

      /**
       * update visualization with group set
       */
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.layers.forEach((layer: any) => {
          if (layer.settings.organisationUnitGroupSet) {
            const organisationUnitGroupSet = _.find(newState.orgUnitGroupSets, ['id', layer.settings.organisationUnitGroupSet.id]);
            if (organisationUnitGroupSet) {
              layer.settings.organisationUnitGroupSet = organisationUnitGroupSet;
            }
          }
        });
        currentVisualizationObject.details.loaded = true;
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

    case FULL_SCREEN_TOGGLE_ACTION: {
      const newState = _.clone(state);
      const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', action.payload.id]);
      if (currentVisualizationObject) {
        const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
        currentVisualizationObject.details.showFullScreen = action.payload.details.showFullScreen;
        currentVisualizationObject.details.cardHeight = action.payload.details.cardHeight;
        currentVisualizationObject.details.itemHeight = action.payload.details.itemHeight;
        newState.visualizationObjects[currentVisualizationObjectIndex] = _.cloneDeep(currentVisualizationObject);
      }
      return newState;
    }

    case FAVORITE_OPTIONS_LOADED_ACTION: {
      const newState = _.clone(state);
      newState.favoriteOptions = action.payload;
      return newState;
    }

    case DASHBOARDS_CUSTOM_SETTINGS_LOADED_ACTION: {
      const newState = _.clone(state);
      newState.customDashboardSettings = action.payload;
      return newState;
    }

    case DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION: {
      const newState = _.clone(state);
      newState.customDashboardSettings = action.payload.dashboardGroupSettings;
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
      const dashboardSearchHeaders: any[] = _.clone(newState.dashboardSearchItems.headers);
      newState.dashboardSearchItems.headers = dashboardSearchHeaders.map(header => {
        const newHeader = _.clone(header);

        if (newHeader.name === action.payload.name) {
          newHeader.selected = action.payload.selected;
        }

        if (action.payload.name === 'all') {
          if (newHeader.name !== 'all' && action.payload.selected) {
            newHeader.selected = false;
          }
        } else {
          if (newHeader.name === 'all' && action.payload.selected) {
            newHeader.selected = false;
          }
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

    case DASHBOARD_ITEM_ADDED_ACTION: {
      const newState = _.clone(state);
      const newDashboardItem = action.payload.dashboardItems.length > 1 ?
        mergeRelatedItems(action.payload.dashboardItems)[0] :
        action.payload.dashboardItems[0];
      if (newDashboardItem) {
        const currentDashboard = _.find(newState.dashboards, ['id', action.payload.dashboardId]);
        if (currentDashboard) {
          const dashboardItems = _.cloneDeep(currentDashboard.dashboardItems);
          const currentDashboardIndex = _.findIndex(newState.dashboards, currentDashboard);
          const availableDashboardItem = _.find(dashboardItems, ['id', newDashboardItem.id]);

          /**
           * Update for list like items .ie. users =, reports ,etc
           */
          if (availableDashboardItem) {
            if (availableDashboardItem[availableDashboardItem.length - 1] === 'S') {
              const availableDashboardItemIndex = _.findIndex(currentDashboard.dashboardItems, availableDashboardItem);
              dashboardItems[availableDashboardItemIndex] = _.cloneDeep(mergeRelatedItems([newDashboardItem, availableDashboardItem]));
            }
          } else {
            newDashboardItem.isNew = true;
            dashboardItems.unshift(newDashboardItem);
          }

          currentDashboard.dashboardItems = _.cloneDeep(dashboardItems);

          /**
           * Save new changes
           */
          newState.dashboards[currentDashboardIndex] = _.cloneDeep(currentDashboard);
        }
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

function handleFavoriteUpdateAction(state, action) {
  const newState = _.clone(state);
  const visualizationObject = _.clone(action.payload.visualizationObject);
  const favoriteObject = _.clone(action.payload.favorite);
  const favoriteError = action.payload.error;
  if (visualizationObject) {
    const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', visualizationObject.id]);
    if (currentVisualizationObject) {
      const currentVisualizationObjectIndex = _.findIndex(newState.visualizationObjects, currentVisualizationObject);
      if (!favoriteError) {
        /**
         * Update visualization settings with favorite if no error
         */
        const favorite: any = _.find(newState.favorites, ['id', visualizationObject.details.favorite.id]);
        if (favorite) {
          currentVisualizationObject.layers = mapFavoriteToLayerSettings(favorite);

          if (favoriteObject) {
            /**
             * Also get map configuration if current visualization is map
             */
            if (currentVisualizationObject.details.currentVisualization === 'MAP') {
              currentVisualizationObject.details.basemap = favoriteObject.basemap;
              currentVisualizationObject.details.zoom = favoriteObject.zoom;
              currentVisualizationObject.details.latitude = favoriteObject.latitude;
              currentVisualizationObject.details.longitude = favoriteObject.longitude;
            }
          }
        }
      } else {
        /**
         * Get error message
         */
        currentVisualizationObject.details.errorMessage = favoriteError;
        currentVisualizationObject.details.hasError = true;
        currentVisualizationObject.details.loaded = true;
      }
      newState.visualizationObjects[currentVisualizationObjectIndex] = _.clone(currentVisualizationObject);
    }
  }

  return newState;
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

function updateVisualizationWithAnalytics1(state: StoreData, action: any) {
  const newState = _.clone(state);
  const analyticsError = action.payload.error;
  const loadedVisualizationObject: Visualization = _.clone(action.payload.visualizationObject);
  const loadedAnalytics = _.clone(action.payload.analytics);

  const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', loadedVisualizationObject.id]);
  if (currentVisualizationObject) {
    const newVisualizationObject: Visualization = _.clone(currentVisualizationObject);
    const visualizationObjectDetails = _.clone(currentVisualizationObject.details);

    /**
     * Return non visualizable items with out analytics
     */
    if (!visualizationObjectDetails.favorite.id) {
      visualizationObjectDetails.loaded = true;
    }

    if (!analyticsError) {

      /**
       * Take visualization settings from source option
       */
      const newVisualizationLayers = _.clone(loadedVisualizationObject.layers.length > 0 ?
        loadedVisualizationObject.layers :
        currentVisualizationObject.layers
      );

      /**
       * Update visualization layer with analytics
       */
      const newVisualizationLayersWithAnalytics = _.map(newVisualizationLayers, (layer: any) => {
        const newLayer = _.clone(layer);
        const analyticsObject = _.find(loadedAnalytics, ['id', newLayer.settings.id]);
        if (analyticsObject) {
          newLayer.analytics = Object.assign({}, analyticsObject.content);
        }
        return newLayer;
      });

      /**
       * copy new layers with analytics into current visualization
       * @type {Array & any}
       */
      newVisualizationObject.layers = Object.assign([], newVisualizationLayersWithAnalytics);

      /**
       * Update analytics loading status
       * @type {boolean}
       */
      visualizationObjectDetails.analyticsLoaded = true;

    } else {
      visualizationObjectDetails.errorMessage = analyticsError;
      visualizationObjectDetails.loaded = true;
      visualizationObjectDetails.hasError = true;
    }

    /**
     * Copy back to current visualization
     * @type {{} & any}
     */
    newVisualizationObject.details = Object.assign({}, visualizationObjectDetails);

    /**
     * Update visualization object
     * @type {[any , any , any]}
     */
    newState.visualizationObjects = replaceArrayItem(
      newState.visualizationObjects,
      {id: currentVisualizationObject.id},
      newVisualizationObject
    );
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

  return dashboardSearchItems;
}

export function handleVisualizationChangeAction(state, action) {
  const newState = _.clone(state);
  const loadedVisualizationObject: Visualization = _.clone(action.payload.visualizationObject);
  const currentVisualizationObject = _.find(newState.visualizationObjects, ['id', loadedVisualizationObject.id]);
  if (currentVisualizationObject) {
    const newVisualizationObject = _.clone(currentVisualizationObject);

    const newVisualizationObjectDetails = _.clone(currentVisualizationObject.details);

    /**
     * Update visualization details
     */
    newVisualizationObjectDetails.currentVisualization = action.payload.selectedVisualization;

    /**
     * Update with favorite details
     */
    const favorite: any = _.find(newState.favorites, ['id', newVisualizationObjectDetails.favorite.id]);

    if (favorite) {

      /**
       * Update with settings and analytics
       */
      newVisualizationObject.layers = _.map(updateFavoriteWithCustomFilters(
        mapFavoriteToLayerSettings(favorite),
        newVisualizationObjectDetails.filters
      ), (layer: any) => {
        const newLayer = _.clone(layer);

        if (layer.settings) {
          const analyticsObject = _.find(newState.analytics, ['id', layer.settings.id]);
          if (analyticsObject) {
            newLayer.analytics = _.assign({}, analyticsObject.content);
          }
        }
        return newLayer;
      });
    }

    /**
     * Compile modified list with details
     */
    newVisualizationObject.details = _.assign({}, newVisualizationObjectDetails);


    newState.visualizationObjects = replaceArrayItem(
      newState.visualizationObjects,
      {id: currentVisualizationObject.id},
      newVisualizationObject);
  }
  return newState;
}

export function updateFavoriteWithCustomFilters(visualizationLayers, customFilters) {
  return _.map(visualizationLayers, (layer) => {
    const newLayer = _.clone(layer);
    const newSettings = _.clone(layer.settings);
    const correspondingFilter = _.find(customFilters, ['id', layer.settings.id]);

    if (correspondingFilter) {
      newSettings.columns = updateLayoutDimensionWithFilters(newSettings.columns, correspondingFilter.filters);
      newSettings.rows = updateLayoutDimensionWithFilters(newSettings.rows, correspondingFilter.filters);
      newSettings.filters = updateLayoutDimensionWithFilters(newSettings.filters, correspondingFilter.filters);
    }

    newLayer.settings = _.assign({}, newSettings);
     return newLayer;
  });
}

function updateLayoutDimensionWithFilters(layoutDimensionArray, filters) {
  return _.map(layoutDimensionArray, (layoutDimension) => {
    const newLayoutDimension = _.clone(layoutDimension);
    const dimensionObject = _.find(filters, ['name', layoutDimension.dimension]);

    /**
     * Get items
     */
    if (dimensionObject) {
      newLayoutDimension.items = _.assign([], dimensionObject.items);
    }

    return newLayoutDimension;
  });
}
