import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataService} from '../../data.service';
import {FeatureCollection, Filters} from '../../../constants/classes';

// @ts-ignore
import * as conflicts from 'src/assets/data/africa-conflict-2018.json';
import cloneDeep from 'lodash/cloneDeep';
import {DEFAULT_FILTERS} from '../../../constants/constants';
import { COUNTRIES } from '../../../constants/constants';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  @Output() selectFilter = new EventEmitter();

  constructor(
    private dataService: DataService,
  ) { }

  conflicts: FeatureCollection = (conflicts as any).default;
  countries = [];
  filters: Filters = cloneDeep(DEFAULT_FILTERS);

  ngOnInit(): void {
    // TODO create master toggle for selection list
    // pass conflict data
    this.dataService.setConflictData(this.conflicts.features);

    // find all countries from conflict data
    this.conflicts.features.forEach(feature => {
      this.countries.push(feature.properties.country);
    });

    // retain only unique country values
    this.countries = [...new Set(this.countries.sort())];

    this.dataService.applyFilters(this.filters);

    // subscribe to selected filters from map component
    this.dataService.filters$.subscribe(filter => {
      this.selectFilter.emit(filter.countries);
    });
  }

  selectCountry(country) {
    // remove country from filters if deselected
    if (this.filters.countries.includes(country)) {
      this.filters.countries.splice(this.filters.countries.indexOf(country), 1);
      this.dataService.applyFilters(this.filters);
    } else {
      // add country to filters if selected
      this.filters.countries.push(country);
      this.dataService.applyFilters(this.filters);
    }
  }

  formatCountryInfo(country, field): number {
    // format selected country data for selected fields
    const data = COUNTRIES.features.filter(c => c.properties.NAME === country).map(c => c.properties[field]);
    return field === 'deaths_per_million' ? data[0].toFixed(2) : data;
  }

}
