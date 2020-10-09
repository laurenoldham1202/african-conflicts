import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Feature, Filters } from '../constants/classes';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private conflictData: BehaviorSubject<Feature[]> = new BehaviorSubject<Feature[]>(undefined);
  conflictData$: Observable<Feature[]> = this.conflictData.asObservable();

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
