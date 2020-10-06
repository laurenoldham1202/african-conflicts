import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';
import {Feature, FeatureCollection} from '../constants/classes';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private conflictData: BehaviorSubject<Feature[]> = new BehaviorSubject<Feature[]>(undefined);
  conflictData$: Observable<Feature[]> = this.conflictData.asObservable();

  // TODO type
  private filters: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  filters$: Observable<any> = this.filters.asObservable();

  constructor() { }

  setConflictData(data: Feature[]) {
    this.conflictData.next(data);
  }

  applyFilters(filters: any) {
    this.filters.next(filters);
  }
}
