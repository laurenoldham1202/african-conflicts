import { Component, OnInit } from '@angular/core';

import * as M from 'mapbox-gl';

import { DataService } from '../data.service';
import {Feature, FeatureCollection, Filters} from '../../constants/classes';
import {COUNTRIES, DEFAULT_FILTERS} from '../../constants/constants';

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

  orangeColors = ['#fde0c5', '#facba6', '#f8b58b', '#f2855d', '#ef6a4c', '#eb4a40'];
  legendBreaks = [[0, 3], [4, 9], [10, 20], [21, 60], [61, 120], [121, 410]];

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

    // convert to different input sharing
    this.dataService.conflictData$.subscribe((data: Feature[]) => {
      if (data) {
        this.conflicts = data;
        // console.log(this.conflicts);
      }
    });

    // // TODO type
    // this.dataService.filters$.subscribe((filters: Filters) => {
    //   if (filters) {
    //     this.filters = filters;
    //     console.log(this.filters);
    //     if (this.filters.countries.length) {
    //
    //       this.map.setFilter('conflicts', ['match', ['get', 'country'], this.filters.countries, true, false]);
    //     } else {
    //       // console.log('all');
    //       this.map.setFilter('conflicts', ['has', 'country']);
    //     }
    //   }
    // });
    // this.dataService.setConflictData(this.conflicts);
    //
    // const style = [];
    // const breaks = [4, 10, 20, 60, 120, 410];
    // breaks.forEach(br => {
    //
    // });
    //
    // this.orangeColors.forEach((color, i) => {
    //   if (i + 1 < this.legendBreaks.length) {
    //     style.push(color, this.legendBreaks[i + 1][0]);
    //   } else {
    //     style.push('')
    //   }
    // });

    // console.log(style);

    this.map.on('load', () => {


      this.map.addLayer({
        id: 'countries',
        type: 'fill',
        source: {
          type: 'geojson',
          data: COUNTRIES,
        },
        paint: {
          'fill-opacity': 1,
          'fill-outline-color': '#555',
          // TODO change black on undefined
          'fill-color': ['step', ['get', 'deaths_per_million'],
            '#fde0c5', 4, '#facba6', 10, '#f8b58b', 20, '#f2855d', 60, '#ef6a4c', 120, '#eb4a40', 410, '#FFF'],
        }
      });

      this.map.addSource('conflicts', {
        type: 'geojson',
        data: {type: 'FeatureCollection', features: this.conflicts},
        // cluster: true,
      });

      this.map.addLayer({
        id: 'conflicts',
        type: 'circle',
        source: 'conflicts',
        paint: {
          'circle-color': 'teal',
          'circle-radius': 3,
        }
      });


      // TODO type
      this.dataService.filters$.subscribe((filters: Filters) => {
        if (filters) {
          this.filters = filters;
          if (this.filters.countries.length) {

            this.map.setFilter('conflicts', ['match', ['get', 'country'], this.filters.countries, true, false]);
          } else {
            // console.log('all');
            this.map.setFilter('conflicts', ['has', 'country']);
          }
        }
      });

    // #fde0c5,#facba6,#f8b58b,#f59e72,#f2855d,#ef6a4c,#eb4a40
      // map.setFilter(layer, ['match', ['get', matchField], matchArray, true, false]);
      // const countries = ['Angola', 'Benin'];
      // this.map.setFilter('conflicts', ['match', ['get', 'country'], this.filters.countries, true, false]);

      const countries = [];
      this.map.on('click', 'countries', (e) => {
        // TODO prevent duplicates
        // console.log(this.filters.countries);
        this.filters.countries.push(e.features[0].properties.NAME);
        // countries.push(e.features[0].properties.NAME);
        // this.filters.countries = countries;
        this.dataService.applyFilters(this.filters);

      });
    });

  }

}
