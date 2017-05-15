import {StoreData, INITIAL_STORE_DATA} from "../store-data";
import * as _ from 'lodash';
import {Dashboard} from "../../model/dashboard";
export function storeDataReducer(state: StoreData = INITIAL_STORE_DATA, action) {
  switch (action.type) {
    case 'CURRENT_USER_LOADED_ACTION': {
      state.currentUser = action.payload;
      return state;
    }

    case 'DASHBOARDS_LOADED_ACTION': {
      state.dashboards = action.payload;
      return state;
    }

    case 'DASHBOARD_UPDATED_ACTION': {
      const newState = Object.assign({}, state);
      newState.dashboards = action.payload;
      return newState;
    }

    case 'CURRENT_VISUALIZATION_CHANGE_ACTION': {
      state.visualizationObjects.map(item => {
        return item.id === action.payload.id ? Object.assign({}, item, action.payload) : item;
      });

      return state;
    }

    case 'FIND_VISUALIZATION_ACTION': {

      return  _.filter(state.visualizationObjects, ['id', action.payload.id])[0];
    }

    case 'DASHBOARD_ADDED_ACTION': {
      state.dashboards = [...state.dashboards, action.payload];
      return state;
    }

    case 'DASHBOARD_DELETED_ACTION': {
      const dashboardToDelete: any = _.filter(state.dashboards, ['id', action.payload])[0];

      const visualizationObjects = dashboardToDelete.dashboardItems.map(dashboardItem => {return dashboardItem.id});

      visualizationObjects.forEach(visualizationObject => {
        state.visualizationObjects.splice(_.indexOf(state.visualizationObjects, _.filter(state.visualizationObjects, ['id', visualizationObject])[0]),1);
      })

      state.dashboards.splice(_.indexOf(state.dashboards, _.filter(state.dashboards, ['id', action.payload])[0]),1);

      return state;
    }

    case 'VISUALIZATION_OBJECT_LOADED_ACTION': {
      state.visualizationObjects = [...state.visualizationObjects, action.payload];
      return state;
    }

    case 'CURRENT_DASHBOARD_CHANGE_ACTION': {
      const username = state.currentUser.userCredentials.username;

      if(username) {
        localStorage.setItem('dhis2.dashboard.current.' + username,action.payload);
      }
      return state;
    }

    case 'LAST_DASHBOARD_CHANGE_ACTION': {
      localStorage.setItem('dhis2.dashboard.current.' + state.currentUser.userCredentials.username,action.payload);
      return state;
    }

    default:
      return state;
  }
}
