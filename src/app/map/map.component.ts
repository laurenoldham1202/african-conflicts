import { Component, OnInit } from '@angular/core';

import * as M from 'mapbox-gl';

// @ts-ignore
import * as conflicts from 'src/assets/data/africa-conflict-2018.json';
import {FeatureCollection} from '../../constants/classes';
import {DataService} from '../data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: M.Map;
  accessToken = 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm52N2gxODJrdWtseWZ5czAyZmp5In0.YkEUt6GvIDujjudu187eyA';

  conflicts: FeatureCollection = (conflicts as any).default;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    (M as any).accessToken = this.accessToken;

    this.map = new M.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: { lon: 18.08970, lat: 1.89502 },
      zoom: 2.9,
    });

    this.dataService.setConflictData(this.conflicts);

  }

}
