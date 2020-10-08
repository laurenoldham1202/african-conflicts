import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {FeatureCollection, Filters} from '../../../constants/classes';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
  ) { }

  // conflicts: FeatureCollection = (conflicts as any).default;
  //
  // form: FormGroup;
  //
  // actors = [];
  // countries = [];
  //
  // options = {
  //   floor: 0,
  //   ceil: 0,
  //   step: 1,
  // };
  //
  // filters: Filters = cloneDeep(DEFAULT_FILTERS);

  conflicts;
  countries;

  countryNames;

  ngOnInit(): void {


    this.dataService.conflicts$.subscribe(conflicts => {
      this.conflicts = conflicts;
    });

    this.dataService.countries$.subscribe(countries => {
      this.countries = countries;
      // console.log(this.countries);
      this.countryNames = this.countries.features.map(y => y.properties.NAME).sort();
      console.log(this.countryNames);
    });


  }

  // ngOnInit(): void {
  //   this.dataService.setConflictData(this.conflicts.features);
  //   //
  //   // // console.log(this.conflicts);
  //   //
  //   // this.form = this.fb.group({
  //   //   countries: [[], Validators.required],
  //   //   actors: [[], Validators.required],
  //   //   fatalities: [[], Validators.required],
  //   // });
  //   //
  //   // // this.dataService.conflictData$.subscribe((data: FeatureCollection) => {
  //   // //   if (data) {
  //   // //     this.conflicts = data;
  //   //
  //   //     // console.log(this.conflicts);
  //   //
  //   // const fatalities = this.conflicts.features.map(x => +x.properties.incident_fatalities);
  //   // const min = Math.min(...fatalities);
  //   // const max = Math.max(...fatalities);
  //   // // console.log(max);
  //   // this.options.floor = min;
  //   // this.options.ceil = max;
  //   // this.form.controls.fatalities.patchValue([min, max]);
  //
  //   this.conflicts.features.forEach(feature => {
  //     this.countries.push(feature.properties.country);
  //     // this.actors.push(feature.properties.actor1, feature.properties.actor2);
  //   });
  //
  //   // TODO create master toggle, remove '' option from actors
  //   // TODO use filter on this.conflicts.features instead of looping?
  //   this.countries = [...new Set(this.countries.sort())];
  //   // this.actors = [...new Set(this.actors.sort())];
  //   // // console.log(this.actors);
  //   //
  //   this.dataService.applyFilters(this.filters);
  //   //
  //   // this.dataService.filters$.subscribe(f => {
  //   //   // console.log(f);
  //   //   this.filters.countries = f.countries;
  //   //   this.form.controls.countries.setValue(this.filters.countries);
  //   //   console.log(this.form.controls.countries.value);
  //   // });
  //
  // }
  //
  // selectCountry(e) {
  //   console.log(this.filters.countries);
  //   // [selected]="filters.countries.includes(shoe)"
  //
  //   // if (this.filters.countries.includes(e)) {
  //   //   this.filters.countries.splice(this.filters.countries.indexOf(e), 1);
  //   //   this.dataService.applyFilters(this.filters);
  //   //
  //   // } else {
  //   //   this.filters.countries.push(e);
  //   //   this.dataService.applyFilters(this.filters);
  //   // }
  // }
  //
  // change() {
  //   console.log('change');
  // }
  // select() {
  //   console.log('select');
  // }
  // //
  // // onchange(e) {
  // //   // console.log(e);
  // // }
  // //
  // // change(): void {
  // //   // console.log(this.form.controls.countries.value);
  // //   // console.log('change');
  // //
  // //   // console.log(countries);
  // //   this.filters.countries = this.form.controls.countries.value;
  // //   this.dataService.applyFilters(this.filters);
  // //   // countries.forEach(country => {
  // //   //   const y = this.conflicts.features.filter(x => x.properties.country === country);
  // //   //   console.log(y);
  // //   // });
  // // }

}
