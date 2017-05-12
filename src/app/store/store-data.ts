import {CurrentUser} from "../model/current-user";
import {Dashboard} from "../model/dashboard";
import {Visualization} from "../model/visualization";
export interface StoreData {
  currentUser: CurrentUser;
  dashboards: Dashboard[];
  visualizationObjects: Visualization[];

}

export const INITIAL_STORE_DATA: StoreData = {
  currentUser: {
    id: undefined,
    organisationUnits: {},
    dataViewOrganisationUnits: {},
    userCredentials: {}
  },
  dashboards: [],
  visualizationObjects: []
};
