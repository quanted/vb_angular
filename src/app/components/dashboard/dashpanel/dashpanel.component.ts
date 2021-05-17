import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashpanel',
  templateUrl: './dashpanel.component.html',
  styleUrls: ['./dashpanel.component.css']
})
export class DashpanelComponent implements OnInit {

  PANEL_TYPES = ["data-table", "box-plot", "line-plot", "scatter-plot"]

  currentPanel = this.PANEL_TYPES[0];

  constructor() { }

  ngOnInit(): void {
  }

  loadPanel(): void {
    console.log('load panel: ')
  }

}
