import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { DatasetService } from "src/app/services/dataset.service";
import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-data",
    templateUrl: "./data.component.html",
    styleUrls: ["./data.component.css"],
})
export class DataComponent implements OnInit {
    @Input() project;
    @Output() setDatasetHeader: EventEmitter<any> = new EventEmitter<any>();

    datasets = [];
    rawData;
    dataset;
    datasetID;

    creatingDataset = false;

    constructor(private dataService: DatasetService, private projectService: ProjectService) {}

    ngOnInit() {
        this.datasetID = this.project.dataset;
        this.dataService.getDatasets().subscribe((datasets) => {
            this.datasets = datasets;
            if (this.datasetID) {
                for (let dataset of datasets) {
                    if (dataset.id == this.datasetID) {
                        this.dataset = dataset;
                        this.setDatasetHeader.emit(this.dataset);
                    }
                }
            }
        });
    }

    selectDataset(dataset) {
        this.projectService.selectDataset(this.project, dataset).subscribe((project) => {
            this.dataset = dataset;
            this.setDatasetHeader.emit(dataset);
        });
    }

    removeDataset(): void {
        this.dataset = null;
        this.selectDataset(null);
    }

    deleteDataset(dataset): void {
        this.dataService.deleteDataset(dataset).subscribe(() => {
            this.dataService.getDatasets().subscribe((datasets) => {
                this.datasets = datasets;
            });
        });
    }

    cancel(): void {
        this.creatingDataset = false;
    }

    onFileChange($event) {
        const target: DataTransfer = <DataTransfer>$event.target;
        if (target.files.length !== 1) {
            console.log("XLSX can only load one file at a time");
            return;
        }
        this.dataService.loadDatasetFromFile(target).subscribe((data) => {
            if (data.error) {
                console.log("error: ", data.error);
                return;
            }
            if (data) {
                this.rawData = data;
                this.creatingDataset = true;
            }
        });
    }

    datasetCreated(dataset): void {
        this.creatingDataset = false;
        this.dataset = dataset;
        this.setDatasetHeader.emit(dataset);
    }
}
