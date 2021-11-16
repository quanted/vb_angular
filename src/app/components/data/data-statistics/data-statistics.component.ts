import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-data-statistics",
  templateUrl: "./data-statistics.component.html",
  styleUrls: ["./data-statistics.component.css"],
})
export class DataStatisticsComponent implements OnInit {
  @Input() dataset;

  constructor() {}

  ngOnInit(): void {}
}
