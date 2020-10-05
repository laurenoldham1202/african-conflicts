export interface Feature {
  geometry: any;
  properties: any;
  type: any;
}

export interface FeatureCollection {
  type: any;
  features: Feature[];
}
