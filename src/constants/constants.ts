import {Filters} from './classes';

export const DEFAULT_FILTERS: Filters = {
  countries: [],
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
