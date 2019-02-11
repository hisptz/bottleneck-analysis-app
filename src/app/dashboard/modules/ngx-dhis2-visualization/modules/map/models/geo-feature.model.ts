export interface GeoFeature {
  id: string;
  code: string;
  hcd: boolean;
  hcu: boolean;
  co: string;
  le: number;
  na: string;
  pg: string;
  pi: string;
  pn: string;
  ty: string;
}

export interface MapOptions {
  label?: boolean;
  data?: any;
  pointToLayer: any;
  usePatterns?: boolean;
}
