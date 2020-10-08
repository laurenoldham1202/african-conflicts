import {Filters} from './classes';

import * as countries from 'src/assets/data/africa-countries-counts.json';
import * as conflicts from 'src/assets/data/africa-conflict-2018.json';

export const DEFAULT_FILTERS: Filters = {
  // countries: [],
  countries: {},
  actors: [],
  dates: {
    start: new Date('01-01-2018'),
    end: new Date('12-31-2018'),
  },
  fatalities: {
    min: 0,
    max: 100,
  }
};

export const COUNTRIES = (countries as any).default;
export const CONFLICTS = (conflicts as any).default;
