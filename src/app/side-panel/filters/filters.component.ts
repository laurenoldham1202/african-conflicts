import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {FeatureCollection} from '../../../constants/classes';
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

  conflicts: FeatureCollection;
  form: FormGroup;

  actors = [];
  countries = [];

  sliderForm: FormGroup = new FormGroup({
    sliderControl: new FormControl([20, 80])
  });
  options = {
    floor: 0,
    ceil: 100,
    step: 5
  };

  ngOnInit(): void {
    this.form = this.fb.group({
      countries: [[], Validators.required],
      actors: [[], Validators.required],
      fatalities: [[50, 70], Validators.required],
    });

    this.dataService.conflictData$.subscribe((data: FeatureCollection) => {
      if (data) {
        this.conflicts = data;

        console.log(this.conflicts);

        const min = Math.min(...this.conflicts.features.map(x => +x.properties.incident_fatalities));
        const max = Math.max(...this.conflicts.features.map(x => +x.properties.incident_fatalities));
        console.log(max);

        this.conflicts.features.forEach(feature => {
          this.countries.push(feature.properties.country);
          this.actors.push(feature.properties.actor1, feature.properties.actor2);
        });

        // TODO create master toggle, remove '' option from actors
        // TODO use filter on this.conflicts.features instead of looping?
        this.countries = [...new Set(this.countries.sort())];
        this.actors = [...new Set(this.actors.sort())];
        // console.log(this.actors);
      }

    });



  }

  onchange(e) {
    console.log(e);
  }

  change(): void {
    console.log('change');

    const countries = this.form.controls.countries.value;
    countries.forEach(country => {
      const x = this.conflicts.features.filter(x => x.properties.country === country);
      console.log(x);
    });
  }

}
