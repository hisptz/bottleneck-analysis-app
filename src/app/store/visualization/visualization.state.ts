export interface MapConfiguration {
  id: string;
  basemap: string;
  name: string;
  subtitle: string;
  zoom: number;
  latitude: string;
  longitude: string;

}

export interface Visualization {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  created: string;
  lastUpdated: string;
  shape: string;
  dashboardId: string;
  description: string;
  details: any;
  layers: any[];
  operatingLayers: any[];
}


export interface VisualizationState {
  visualizationObjects: Visualization[];
}

export const INITIAL_VISUALIZATION_STATE: VisualizationState = {
  visualizationObjects: []
}
