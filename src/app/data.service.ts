import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';
import {FeatureCollection} from '../constants/classes';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private conflictData: BehaviorSubject<FeatureCollection> = new BehaviorSubject<FeatureCollection>(undefined);
  conflictData$: Observable<FeatureCollection> = this.conflictData.asObservable();

  constructor() { }

  setConflictData(data: FeatureCollection) {
    this.conflictData.next(data);
  }
}
