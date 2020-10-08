import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';

import { CONFLICTS } from '../constants/constants';
import { COUNTRIES } from '../constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'african-conflicts';

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.dataService.setConflicts(CONFLICTS);
    this.dataService.setCountries(COUNTRIES);
  }
}
