import { Component, OnInit } from '@angular/core';

// external imports
import * as M from 'mapbox-gl';

// internal imports
import { DataService } from '../data.service';
import { Feature, FeatureCollection, Filters } from '../../constants/classes';

// constants
import { COUNTRIES } from '../../constants/constants';

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

  // because these colors are reused, I would normally iterate through them via this array to maintain DRY principles,
  // but here I used ngClass in the HTML template to demonstrate dynamic class assignments
  orangeColors = ['#fde0c5', '#facba6', '#f8b58b', '#f2855d', '#ef6a4c', '#eb4a40'];
  legendBreaks = [[0, 3], [3, 9], [9, 20], [20, 60], [60, 120], [120, 410]];

  popup: M.Popup;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    (M as any).accessToken = this.accessToken;

    // instantiate map
    this.map = new M.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: { lon: 18.08970, lat: 6.99502 },
      zoom: 2.5,
      doubleClickZoom: false,
    });

    // subscribe to conflict data stream
    this.dataService.conflictData$.subscribe((data: Feature[]) => {
      if (data) {
        this.conflicts = data;
      }
    });

    this.map.on('load', () => {

      // add colored countries background
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

      // add conflicts source geojson
      this.map.addSource('conflicts', {
        type: 'geojson',
        data: {type: 'FeatureCollection', features: this.conflicts},
      });

      // add conflicts layer
      this.map.addLayer({
        id: 'conflicts',
        type: 'circle',
        source: 'conflicts',
        paint: {
          'circle-color': 'teal',
          'circle-radius': 3,
        }
      });

      // subscribe to data filters from filter component
      this.dataService.filters$.subscribe((filters: Filters) => {
        if (filters) {
          this.filters = filters;  // set filters in map component
          if (this.filters.countries.length) {
            // if countries are selected from filters, filter conflicts for those countries
            this.map.setFilter('conflicts', ['match', ['get', 'country'], this.filters.countries, true, false]);
          } else {
            // if no countries are selected, filter for all conflicts
            this.map.setFilter('conflicts', ['has', 'country']);
          }
        }
      });

      // map click event
      this.map.on('click', 'countries', (e) => {
        const props = e.features[0].properties;  // target properties
        const country = props.NAME;  // selected country

        // prevent passing data when data is undefined
        if (props.count > 0) {
          if (!this.filters.countries.includes(country)) {
            // if country does not exist in array, push value on click
            this.filters.countries.push(country);
          } else {
            // if country DOES exist in array (i.e. it is deselected), remove it from selected countries filter
            this.filters.countries.splice(this.filters.countries.indexOf(country), 1);
          }
        }

        // apply newly selected filters app-wide
        this.dataService.applyFilters(this.filters);
      });

      this.map.on('mouseover', 'conflicts', (e) => {

        // remove existing popup on new mouseover event, i.e. only one popup visible at a time
        if (this.popup) {
          this.popup.remove();
        }

        // set popup format with conflict data
        const props = e.features[0].properties;
        const content = `
        <strong>Fatalities: </strong> ${props.incident_fatalities}
        <br><strong>Date: </strong> ${props.date}
        <br><strong>Location: </strong> ${props.location}, ${props.country}
        <br><strong> Involved Parties: </strong> ${props.actor1} and ${props.actor2}
        `;

        // set popup for each conflict point
        this.popup = new M.Popup({closeButton: false})
          .setLngLat(e.lngLat).setHTML(content).addTo(this.map);
      });

      // remove any popups on mouseout
      this.map.on('mouseout', 'conflicts', (e) => {
        this.popup.remove();
      });
    });
  }
}
