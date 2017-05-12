export interface Visualization {
  id: string;
  name: string;
  type: string;
  created: string;
  lastUpdated: string;
  shape: string;
  details: any;
  layers: Array<{
    settings: any;
    analytics: any;
  }>;
  operatingLayers: Array<{
    settings: any;
    analytics: any;
  }>;
}
