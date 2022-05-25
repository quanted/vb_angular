import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { DatasetService } from "src/app/services/dataset.service";
import { ProjectService } from "src/app/services/project.service";

@Component({
    selector: "app-data-create",
    templateUrl: "./data-create.component.html",
    styleUrls: ["./data-create.component.css"],
})
export class DataCreateComponent implements OnInit, AfterViewInit {
    @Input() project;
    @Input() rawData;
    @Output() datasetCreated: EventEmitter<any> = new EventEmitter<any>();

    datasetForm: FormGroup;
    dv = [];

    dataCSV = "";
    dataArray = [];

    columnData = [];
    columnNames = [];

    // selected rows are pairs of indices in ascending order
    // selectedRows = [[10, 20], [30, 40], ...]
    selectedRows = [];
    selectedRowsString = "";

    generateAO = false;

    statusMessage = "";

    currentDatasetStatistics = null;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource();
    constructor(
        private fb: FormBuilder,
        private datasetService: DatasetService,
        private projectService: ProjectService
    ) {}

    ngOnInit(): void {
        this.datasetForm = this.fb.group({
            name: [null, Validators.required],
            description: [null, Validators.required],
            totalRows: [null],
            startRow: [null, Validators.required],
            endRow: [null, Validators.required],
            selectedRows: [null],
            target: [null, Validators.required],
            features: [null, Validators.required],
            bearing: [null],
            magnitude: [null],
        });
        this.parseRawData();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    parseRawData(): void {
        this.dataArray = this.rawData.dataArray;
        this.dataCSV = this.rawData.dataCSV;

        this.columnNames = this.dataArray[0];
        const columnValues = this.dataArray.slice(1);
        for (let i = 0; i < columnValues.length; i++) {
            const record = {};
            const values = columnValues[i];
            for (let j = 0; j < this.columnNames.length; j++) {
                record[this.columnNames[j]] = values[j];
            }
            this.columnData.push(record);
        }

        this.dataSource.data = this.columnData;
        this.dataSource.paginator = this.paginator;
        this.datasetForm.get("name").setValue(this.rawData.fileName);
    }

    rowClicked(): void {
        console.log("row clicked!");
    }

    selectAllRows(): void {
        this.selectedRows = [];
        this.datasetForm.get("startRow").setValue(1);
        this.datasetForm.get("endRow").setValue(this.columnData.length);
        this.selectRows();
    }

    selectRows(): void {
        if (this.datasetForm.get("startRow").valid && this.datasetForm.get("endRow").valid) {
            const start = this.datasetForm.get("startRow").value;
            const end = this.datasetForm.get("endRow").value;
            // TODO: add a modals for these 3 situations
            if (end <= start || start < 1 || end > this.columnData.length) return;

            // if there aren't any ranges just add it
            if (this.selectedRows.length === 0) {
                this.selectedRows.push([start, end]);
            }
            // find where the new range belongs or if ranges need to be merged
            else {
                let newRange = [start, end];
                // is it's end index less that the first range's start index - 1?
                // if so put the new range at the start of the list
                if (newRange[1] < this.selectedRows[0][0] - 1) {
                    this.selectedRows.splice(0, 0, newRange);
                }
                // is it's start index more than the last range's end index + 1?
                // if so put the new range at the end of the list
                else if (newRange[0] > this.selectedRows[this.selectedRows.length - 1][1] + 1) {
                    this.selectedRows.splice(this.selectedRows.length, 0, newRange);
                }
                // figure out if there's any over lap and create new ranges if so, or insert
                // the new range into the appropriate place in the list
                else {
                    let includedRanges = [];
                    for (let i = 0; i < this.selectedRows.length; i++) {
                        // if new range starts after this range continue
                        if (newRange[0] > this.selectedRows[i][1] + 1) continue;
                        // if new range ends before this range continue
                        if (newRange[1] < this.selectedRows[i][0] - 1) continue;
                        // otherwise new range is at least partially contained by this range
                        // so add it's index so we can update the list after loop
                        includedRanges.push(i);
                        // if new range begins inside this range
                        // make new range start at the start of this range
                        if (newRange[0] > this.selectedRows[i][0]) {
                            newRange[0] = this.selectedRows[i][0];
                        }
                        // if new range ends inside this range
                        // make new range end at the end of this range
                        if (newRange[1] < this.selectedRows[i][1]) {
                            newRange[1] = this.selectedRows[i][1];
                        }
                    }
                    this.selectedRows.splice(includedRanges[0], includedRanges.length, newRange);
                }
            }
            this.setSelectedRows();
        }
    }

    clearSelectedRows(): void {
        this.selectedRows = [];
        this.setSelectedRows();
    }

    setSelectedRows() {
        let totalRows = 0;
        this.selectedRowsString = "";
        if (this.selectedRows.length > 0) {
            for (let i = 0; i < this.selectedRows.length; i++) {
                let range = this.selectedRows[i];
                this.selectedRowsString += `[${range[0]}, ${range[1]}]`;
                if (i < this.selectedRows.length - 1) {
                    this.selectedRowsString += ", ";
                }
                totalRows += range[1] - range[0] + 1;
            }
        }
        this.datasetForm.get("selectedRows").setValue(this.selectedRowsString);
        this.datasetForm.get("totalRows").setValue(totalRows);
    }

    createDataset(): void {
        if (this.datasetForm.valid) {
            const formValues = this.datasetForm.value;
            const newDataset = {
                name: formValues.name,
                description: formValues.description,
                data: this.dataCSV,
            };

            if (this.generateAO) {
                if (this.datasetForm.get("bearing") && this.datasetForm.get("magnitude")) {
                    newDataset["metadata"] = JSON.stringify({
                        target: formValues.target,
                        features: formValues.features,
                        startRow: formValues.startRow,
                        endRow: formValues.endRow,
                        velocity: {
                            bearing: formValues.bearing,
                            magnitude: formValues.magnitude,
                        },
                    });
                } else {
                    this.statusMessage = "Bearing and magnitude required";
                }
            } else {
                newDataset["metadata"] = JSON.stringify({
                    target: formValues.target,
                    features: this.dv,
                    startRow: formValues.startRow,
                    endRow: formValues.endRow,
                });
            }
            // TODO: both of these observables could probably use some error handling
            this.datasetService.createDataset(newDataset).subscribe((dataset) => {
                this.currentDatasetStatistics = dataset.statistics;
                console.log("datasetStats: ", this.currentDatasetStatistics);
                this.projectService.selectDataset(this.project, dataset).subscribe(() => {
                    this.datasetCreated.emit(dataset);
                });
            });
        } else {
            this.statusMessage = "Form invalid!";
        }
    }

    // this handles checkbox and radio button state
    updateInputs(varSet, value) {
        let inputIV = document.getElementById(value + "IV");
        let inputDV = document.getElementById(value + "DV");
        let inputA = document.getElementById(value + "A");
        let inputO = document.getElementById(value + "O");
        switch (varSet) {
            case "IV":
                this.datasetForm.get("target").setValue(value);
                inputDV["checked"] = false;
                this.dv = this.dv.filter((val) => {
                    return val != value;
                });
                this.datasetForm.get("features").setValue(this.dv.join(", "));
                if (inputA) {
                    inputA["checked"] = false;
                    if (value === this.datasetForm.get("bearing").value) {
                        this.datasetForm.get("bearing").setValue(null);
                    }
                }
                if (inputO) {
                    inputO["checked"] = false;
                    if (value === this.datasetForm.get("magnitude").value) {
                        this.datasetForm.get("magnitude").setValue(null);
                    }
                }
                break;
            case "DV":
                inputIV["checked"] = false;
                if (value === this.datasetForm.get("target").value) {
                    this.datasetForm.get("target").setValue(null);
                }
                if (inputDV["checked"] === false) {
                    this.dv = this.dv.filter((val) => {
                        return val != value;
                    });
                } else {
                    if (!this.dv.includes(value)) {
                        this.dv.push(value);
                    }
                }
                this.datasetForm.get("features").setValue(this.dv.join(", "));
                if (inputA) {
                    inputA["checked"] = false;
                    if (value === this.datasetForm.get("bearing").value) {
                        this.datasetForm.get("bearing").setValue(null);
                    }
                }
                if (inputO) {
                    inputO["checked"] = false;
                    if (value === this.datasetForm.get("magnitude").value) {
                        this.datasetForm.get("magnitude").setValue(null);
                    }
                }
                break;
            case "A":
                inputIV["checked"] = false;
                if (value === this.datasetForm.get("target").value) {
                    this.datasetForm.get("target").setValue(null);
                }
                inputDV["checked"] = false;
                this.dv = this.dv.filter((val) => {
                    return val != value;
                });
                this.datasetForm.get("features").setValue(this.dv.join(", "));
                this.datasetForm.get("bearing").setValue(value);
                if (inputO) {
                    inputO["checked"] = false;
                    if (value === this.datasetForm.get("magnitude").value) {
                        this.datasetForm.get("magnitude").setValue(null);
                    }
                }
                break;
            case "O":
                inputIV["checked"] = false;
                if (value === this.datasetForm.get("target").value) {
                    this.datasetForm.get("target").setValue(null);
                }
                inputDV["checked"] = false;
                this.dv = this.dv.filter((val) => {
                    return val != value;
                });
                this.datasetForm.get("features").setValue(this.dv.join(", "));
                if (inputA) {
                    inputA["checked"] = false;
                    if (value === this.datasetForm.get("bearing").value) {
                        this.datasetForm.get("bearing").setValue(null);
                    }
                }
                this.datasetForm.get("magnitude").setValue(value);
                break;
            default:
                console.log(`ERROR: invalid input! ${varSet} | ${value}`);
        }
    }

    toggleAO(): void {
        this.generateAO = !this.generateAO;
        if (!this.generateAO) {
            this.datasetForm.get("bearing").setValue(null);
            this.datasetForm.get("magnitude").setValue(null);
        }
    }

    cancel(): void {
        this.datasetCreated.emit(null);
    }
}
