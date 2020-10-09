import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  panelVisible = true;

  constructor() { }

  ngOnInit(): void {
  }

  togglePanel() {
    this.panelVisible = !this.panelVisible;
  }

  selectFilter(selectedCountries) {

    this.panelVisible = selectedCountries.length === 0;
    // console.log(e);
    // if (e.length) {
    //   this.panelVisible = false;
    // }
  }
}
