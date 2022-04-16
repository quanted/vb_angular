import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { DatasetService } from "src/app/services/dataset.service";

@Component({
    selector: "app-data",
    templateUrl: "./data.component.html",
    styleUrls: ["./data.component.css"],
})
export class DataComponent implements OnInit {
    @Input() datasetID;
    @Output() setDataset: EventEmitter<any> = new EventEmitter<any>();

    datasets = [];
    rawData;
    dataset;

    creatingDataset = false;

    constructor(private dataService: DatasetService) {}

    ngOnInit() {
        this.dataService.getDatasets().subscribe((datasets) => {
            this.datasets = datasets;
            if (this.datasetID) {
                this.dataset = this.datasets.find((dataset) => {
                    return dataset.id == this.datasetID;
                });
                if (this.dataset) {
                    this.setDataset.emit(this.dataset);
                }
            }
        });
    }

    selectDataset(dataset) {
        this.dataset = dataset;
        this.setDataset.emit(dataset);
    }

    removeDataset(): void {
        this.dataset = null;
        this.setDataset.emit(null);
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
            console.log("well?: ", data);
            if (data) {
                this.rawData = data;
                this.creatingDataset = true;
            }
        });
    }

    datasetCreated(dataset): void {
        this.creatingDataset = false;
        this.dataset = dataset;
        this.setDataset.emit(dataset);
    }
}
