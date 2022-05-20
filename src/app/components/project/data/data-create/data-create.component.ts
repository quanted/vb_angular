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

    // selectedRows = [[range1_start, range1_end], [range2_start, range2_end], ...]
    selectedRows = [];

    generateAO = false;

    statusMessage = "";

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
        this.columnNames = ["row", ...this.columnNames];
        const columnValues = this.dataArray.slice(1);
        for (let i = 0; i < columnValues.length; i++) {
            const record = {};
            const values = columnValues[i];
            for (let j = 0; j < this.columnNames.length; j++) {
                record[this.columnNames[j]] = j == 0 ? i : values[j - 1];
            }
            this.columnData.push(record);
        }

        this.dataSource.data = this.columnData;
        this.dataSource.paginator = this.paginator;
        this.datasetForm.get("name").setValue(this.rawData.fileName);
    }

    selectAllRows(): void {
        this.datasetForm.get("startRow").setValue(0);
        this.datasetForm.get("endRow").setValue(this.columnData.length - 1);
        this.selectRows();
    }

    selectRows(): void {
        if (this.datasetForm.get("startRow").valid && this.datasetForm.get("endRow").valid) {
            const start = this.datasetForm.get("startRow").value;
            const end = this.datasetForm.get("endRow").value;
            if (this.selectedRows.length === 0) {
                this.selectedRows.push([start, end]);
            } else {
                let newRange = [start, end];
                this.selectedRows.push(newRange);
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
        let selectedRowsString = "";
        if (this.selectedRows.length > 0) {
            for (let range of this.selectedRows) {
                selectedRowsString += `[${range[0]}, ${range[1]}] `;
                totalRows += range[1] - range[0];
            }
        }
        this.datasetForm.get("selectedRows").setValue(selectedRowsString);
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
