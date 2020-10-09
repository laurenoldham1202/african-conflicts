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
  legendBreaks = [[0, 3], [3, 9], [9, 20], [20, 60], [60, 120], [120, 410]];

  popup: M.Popup;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    (M as any).accessToken = this.accessToken;

    this.map = new M.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: { lon: 18.08970, lat: 6.99502 },
      zoom: 2.5,
      doubleClickZoom: false,
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
            // console.log(this.filters.countries);
            this.map.setFilter('conflicts', ['match', ['get', 'country'], this.filters.countries, true, false]);
          } else {
            // console.log('all');
            this.map.setFilter('conflicts', ['has', 'country']);
          }
        }
      });

      this.map.on('click', 'countries', (e) => {
        const props = e.features[0].properties;
        const country = props.NAME;

        // prevent passing data when data is undefined
        if (props.count > 0) {
          if (!this.filters.countries.includes(country)) {
            this.filters.countries.push(country);
          } else {
            this.filters.countries.splice(this.filters.countries.indexOf(country), 1);
          }
        }
        this.dataService.applyFilters(this.filters);

      });

      this.map.on('mouseover', 'conflicts', (e) => {
        if (this.popup) {
          this.popup.remove();
        }
        const props = e.features[0].properties;
        const content = `
        <strong>Fatalities: </strong> ${props.incident_fatalities}
        <br><strong>Date: </strong> ${props.date}
        <br><strong>Location: </strong> ${props.location}, ${props.country}
        <br><strong> Involved Parties: </strong> ${props.actor1} and ${props.actor2}
        `;
        this.popup = new M.Popup({closeButton: false})
          .setLngLat(e.lngLat).setHTML(content).addTo(this.map);
      });

      this.map.on('mouseout', 'conflicts', (e) => {
        this.popup.remove();
      });

    });

  }

}
