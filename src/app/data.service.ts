import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';
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

  constructor() { }

  setConflictData(data: Feature[]) {
    this.conflictData.next(data);
  }

  applyFilters(filters: Filters) {
    this.filters.next(filters);
  }
}
