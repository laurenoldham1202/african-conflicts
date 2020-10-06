import { Component, OnInit } from '@angular/core';

import * as M from 'mapbox-gl';

import { DataService } from '../data.service';
import {Feature, FeatureCollection, Filters} from '../../constants/classes';
import {DEFAULT_FILTERS} from '../../constants/constants';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: M.Map;
  accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA';

  conflicts: Feature[];

  filters: Filters;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    (M as any).accessToken = this.accessToken;

    this.map = new M.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: { lon: 18.08970, lat: 1.89502 },
      zoom: 2.9,
    });

    console.log(new Date('08-04-2018'));

    // convert to different input sharing
    this.dataService.conflictData$.subscribe((data: Feature[]) => {
      if (data) {
        this.conflicts = data;
        // console.log(this.conflicts);
      }
    });

    // TODO type
    this.dataService.filters$.subscribe((filters: Filters) => {
      if (filters) {
        this.filters = filters;
        console.log(this.filters);
        if (this.filters.countries.length) {

          this.map.setFilter('conflicts', ['match', ['get', 'country'], this.filters.countries, true, false]);
        } else {
          // console.log('all');
          this.map.setFilter('conflicts', ['has', 'country']);

        }

      }


    });
    // this.dataService.setConflictData(this.conflicts);

    this.map.on('load', () => {
      this.map.addSource('conflicts', {
        type: 'geojson',
        data: {type: 'FeatureCollection', features: this.conflicts},
      });

      this.map.addLayer({
        id: 'conflicts',
        type: 'circle',
        source: 'conflicts',
      });

      // map.setFilter(layer, ['match', ['get', matchField], matchArray, true, false]);
      // const countries = ['Angola', 'Benin'];
      // this.map.setFilter('conflicts', ['match', ['get', 'country'], this.filters.countries, true, false]);

    });

  }

}
