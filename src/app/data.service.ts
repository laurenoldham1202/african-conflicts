import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Feature, FeatureCollection, Filters} from '../constants/classes';
import {DEFAULT_FILTERS} from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private conflictData: BehaviorSubject<Feature[]> = new BehaviorSubject<Feature[]>(undefined);
  conflictData$: Observable<Feature[]> = this.conflictData.asObservable();

  // TODO type
  private filters: BehaviorSubject<Filters> = new BehaviorSubject<Filters>(undefined);
  filters$: Observable<Filters> = this.filters.asObservable();

  private conflicts: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  conflicts$: Observable<any> = this.conflicts.asObservable();

  private countries: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  countries$: Observable<any> = this.countries.asObservable();

  private selectedCountries: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  selectedCountries$: Observable<any> = this.selectedCountries.asObservable();

  private map: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  map$: Observable<any> = this.map.asObservable();

  constructor() { }


  setConflicts(data: any) {
    this.conflicts.next(data);
  }

  setCountries(data: any) {
    this.countries.next(data);
  }

  setSelectedCountries(data: any) {
    this.selectedCountries.next(data);
  }

  setConflictData(data: Feature[]) {
    this.conflictData.next(data);
  }

  applyFilters(filters: Filters) {
    this.filters.next(filters);
  }

  applyMapFilter(map, selected) {
    map.setFilter('conflicts', ['match', ['get', 'country'], selected, true, false]);
  }


  setMap(map) {
    this.map.next(map);
  }
}
