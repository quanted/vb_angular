import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-pipeline-status",
    templateUrl: "./pipeline-status.component.html",
    styleUrls: ["./pipeline-status.component.css"],
})
export class PipelineStatusComponent implements OnInit {
    @Input() pipelines;
    constructor() {}

    ngOnInit(): void {}
}
