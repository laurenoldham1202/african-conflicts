export interface Feature {
  geometry: any;
  properties: any;
  type: any;
}

export interface FeatureCollection {
  type: any;
  features: Feature[];
}

export interface Filters {
  countries: string[];
  actors: string[];
  dates: {
    start: Date;
    end: Date;
  };
  fatalities: {
    min: number;
    max: number;
  };
}
