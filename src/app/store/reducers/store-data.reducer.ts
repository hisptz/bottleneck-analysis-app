import {StoreData, INITIAL_STORE_DATA} from "../store-data";
import * as _ from 'lodash';
import {Dashboard} from "../../model/dashboard";
export function storeDataReducer(state: StoreData = INITIAL_STORE_DATA, action) {
  switch (action.type) {
    case 'CURRENT_USER_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.currentUser = action.payload;
      return newState;
    }

    case 'DASHBOARDS_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.dashboards = action.payload;
      return newState;
    }

    case 'DASHBOARD_UPDATED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.dashboards.forEach(dashboard => {
        if(dashboard.id === action.payload.id) {
          dashboard.name = action.payload.name;
        }
      });
      return newState;
    }

    case 'CURRENT_VISUALIZATION_CHANGE_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.visualizationObjects.map(item => {
        return item.id === action.payload.id ? action.payload : item;
      });

      return newState;
    }

    case 'FIND_VISUALIZATION_ACTION': {
      const newState: StoreData = _.clone(state);
      return  _.filter(newState.visualizationObjects, ['id', action.payload.id])[0];
    }

    case 'DASHBOARD_ADDED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.dashboards = [...newState.dashboards, action.payload];
      return newState;
    }

    case 'DASHBOARD_ITEM_ADDED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.dashboards.forEach(dashboard => {
        if(dashboard.id == action.payload.id) {
          if(dashboard.dashboardItems.length > 0) {
            action.payload.dashboardItems.forEach(item => {
              let existingItem = _.find(dashboard.dashboardItems, ['id', item.id]);
              if(existingItem) {
                dashboard.dashboardItems[dashboard.dashboardItems.indexOf(existingItem)] = item;
              } else {
                dashboard.dashboardItems.unshift(item);
              }
            })
          } else {
            dashboard.dashboardItems = action.payload.dashboardItems;
          }
        }
      });
      return newState;
    }

    case 'DASHBOARD_DELETED_ACTION': {
      const newState: StoreData = _.clone(state);
      const dashboardToDelete: any = _.filter(newState.dashboards, ['id', action.payload])[0];

      const visualizationObjects = dashboardToDelete.dashboardItems.map(dashboardItem => {return dashboardItem.id});

      visualizationObjects.forEach(visualizationObject => {
        newState.visualizationObjects.splice(_.indexOf(newState.visualizationObjects, _.filter(newState.visualizationObjects, ['id', visualizationObject])[0]),1);
      })

      newState.dashboards.splice(_.indexOf(newState.dashboards, _.filter(newState.dashboards, ['id', action.payload])[0]),1);

      return newState;
    }

    case 'VISUALIZATION_OBJECT_LOADED_ACTION': {
      const newState: StoreData = _.clone(state);
      newState.visualizationObjects = [...newState.visualizationObjects, action.payload];
      return newState;
    }

    case 'CURRENT_DASHBOARD_CHANGE_ACTION': {
      const newState: StoreData = _.clone(state);
      const username = newState.currentUser.userCredentials.username;

      if(username) {
        localStorage.setItem('dhis2.dashboard.current.' + username,action.payload);
      }
      return newState;
    }

    case 'LAST_DASHBOARD_CHANGE_ACTION': {
      const newState: StoreData = _.clone(state);
      localStorage.setItem('dhis2.dashboard.current.' + newState.currentUser.userCredentials.username,action.payload);
      return newState;
    }

    case 'DASHBOARD_ITEM_DELETED_ACTION' : {
      const newState: StoreData = _.clone(state);
      newState.dashboards.forEach(dashboard => {
        if(dashboard.id == action.payload.dashboardId) {
          dashboard.dashboardItems.splice(_.indexOf(dashboard.dashboardItems,_.find(dashboard.dashboardItems,['id', action.payload.id])),1);
        }
      });

      newState.visualizationObjects.splice(_.indexOf(state.visualizationObjects, ['id', action.payload.id]),1);

      return newState;

    }

    default:
      return state;
  }
}
