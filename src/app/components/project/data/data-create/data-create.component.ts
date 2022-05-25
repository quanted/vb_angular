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

        console.log("testStats: ", testStatistics);
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
const testStatistics = {
    Time_Stamp: {
        "Variable Name": "Time_Stamp",
        "Variable Type": "categorical",
        "Row Count": 56,
    },
    F_pfu: {
        "Variable Name": "F_pfu",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 17.8,
        "Minimum Value": 0.5,
        "Average Value": 2.739285714285714,
        "Unique Values": 22,
        "Zero Count": 0,
        "Median Value": 1.9,
        "Data Range": 17.3,
        "A-D Statistics": 6.5522320576269095,
        "A-D Stat P-Value": 0.0005340730866392196,
        "Mean Value": 2.739285714285714,
        "Standard Deviation": 3.205056193591874,
        Variance: 10.272385204081633,
        Kurtosis: 7.516003929687271,
        Skewness: 2.5247742643772195,
    },
    S_pfu: {
        "Variable Name": "S_pfu",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 685.7,
        "Minimum Value": 0.5,
        "Average Value": 93.52321428571429,
        "Unique Values": 51,
        "Zero Count": 0,
        "Median Value": 46.65,
        "Data Range": 685.2,
        "A-D Statistics": 6.022806745793368,
        "A-D Stat P-Value": 0.000941749585880225,
        "Mean Value": 93.52321428571429,
        "Standard Deviation": 130.88837254790738,
        Variance: 17131.766068239795,
        Kurtosis: 7.7618329602146225,
        Skewness: 2.666714889605447,
    },
    mpn: {
        "Variable Name": "mpn",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 21003,
        "Minimum Value": 61,
        "Average Value": 1354.892857142857,
        "Unique Values": 55,
        "Zero Count": 0,
        "Median Value": 576.5,
        "Data Range": 20942,
        "A-D Statistics": 11.767629873279304,
        "A-D Stat P-Value": 5.1801530731587775e-8,
        "Mean Value": 1354.892857142857,
        "Standard Deviation": 2990.1887343597286,
        Variance: 8941228.667091835,
        Kurtosis: 31.429017715641166,
        Skewness: 5.451871950832582,
    },
    cfu: {
        "Variable Name": "cfu",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 111666.7,
        "Minimum Value": 100,
        "Average Value": 3698.217857142857,
        "Unique Values": 42,
        "Zero Count": 0,
        "Median Value": 908.35,
        "Data Range": 111566.7,
        "A-D Statistics": 16.274948339530937,
        "A-D Stat P-Value": 0,
        "Mean Value": 3698.217857142857,
        "Standard Deviation": 14856.155622503362,
        Variance: 220705359.88003826,
        Kurtosis: 46.83992341355559,
        Skewness: 6.870478705751639,
    },
    pH: {
        "Variable Name": "pH",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 8.6,
        "Minimum Value": 4.4,
        "Average Value": 8.096428571428572,
        "Unique Values": 15,
        "Zero Count": 0,
        "Median Value": 8.4,
        "Data Range": 4.199999999999999,
        "A-D Statistics": 8.262550584776676,
        "A-D Stat P-Value": 0.00008228107938523799,
        "Mean Value": 8.096428571428572,
        "Standard Deviation": 0.7743578643242518,
        Variance: 0.5996301020408163,
        Kurtosis: 7.597255833499412,
        Skewness: -2.5722341252137344,
    },
    DO: {
        "Variable Name": "DO",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 116.6,
        "Minimum Value": 82.1,
        "Average Value": 99.23571428571428,
        "Unique Values": 54,
        "Zero Count": 0,
        "Median Value": 99.45,
        "Data Range": 34.5,
        "A-D Statistics": 0.48494166687653717,
        "A-D Stat P-Value": 0.7622238312602052,
        "Mean Value": 99.23571428571428,
        "Standard Deviation": 9.1854199019702,
        Variance: 84.37193877551022,
        Kurtosis: -1.0256488450430385,
        Skewness: -0.11732061771722677,
    },
    CONDUCTIVITY: {
        "Variable Name": "CONDUCTIVITY",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 427.9,
        "Minimum Value": 260.4,
        "Average Value": 321.2857142857143,
        "Unique Values": 56,
        "Zero Count": 0,
        "Median Value": 318.1,
        "Data Range": 167.5,
        "A-D Statistics": 2.157890726144302,
        "A-D Stat P-Value": 0.07533845192721345,
        "Mean Value": 321.2857142857143,
        "Standard Deviation": 23.653008179053405,
        Variance: 559.4647959183673,
        Kurtosis: 6.98517998518899,
        Skewness: 1.8341351969663968,
    },
    TURBIDITY: {
        "Variable Name": "TURBIDITY",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 26.7,
        "Minimum Value": 0.3,
        "Average Value": 4.674999999999999,
        "Unique Values": 40,
        "Zero Count": 0,
        "Median Value": 2.45,
        "Data Range": 26.4,
        "A-D Statistics": 6.312823932815327,
        "A-D Stat P-Value": 0.0006898577942665574,
        "Mean Value": 4.674999999999999,
        "Standard Deviation": 5.927726919196888,
        Variance: 35.13794642857143,
        Kurtosis: 5.400410331871736,
        Skewness: 2.3899300530762266,
    },
    WATER_TEMP: {
        "Variable Name": "WATER_TEMP",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 23.9,
        "Minimum Value": 14,
        "Average Value": 20.487499999999994,
        "Unique Values": 40,
        "Zero Count": 0,
        "Median Value": 21.15,
        "Data Range": 9.899999999999999,
        "A-D Statistics": 1.4184123967940536,
        "A-D Stat P-Value": 0.1972160270488199,
        "Mean Value": 20.487499999999994,
        "Standard Deviation": 2.5372272900606623,
        Variance: 6.437522321428571,
        Kurtosis: -0.6234634737309759,
        Skewness: -0.6498843822653952,
    },
    RAIN_24hr: {
        "Variable Name": "RAIN_24hr",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 2.381,
        "Minimum Value": 0,
        "Average Value": 0.1714642857142857,
        "Unique Values": 20,
        "Zero Count": 34,
        "Median Value": 0,
        "Data Range": 2.381,
        "A-D Statistics": 13.127389884928363,
        "A-D Stat P-Value": 2.904587681484827e-11,
        "Mean Value": 0.1714642857142857,
        "Standard Deviation": 0.4600664534408401,
        Variance: 0.21166114158163268,
        Kurtosis: 12.078106890132897,
        Skewness: 3.4961189129001538,
    },
    RAIN_48hr: {
        "Variable Name": "RAIN_48hr",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 2.625,
        "Minimum Value": 0,
        "Average Value": 0.41037500000000005,
        "Unique Values": 24,
        "Zero Count": 23,
        "Median Value": 0.07450000000000001,
        "Data Range": 2.625,
        "A-D Statistics": 7.155739242574072,
        "A-D Stat P-Value": 0.0002802822427188101,
        "Mean Value": 0.41037500000000005,
        "Standard Deviation": 0.6719681795851646,
        Variance: 0.45154123437500004,
        Kurtosis: 3.2240411467754395,
        Skewness: 1.9924009128523794,
    },
    RAIN_72hr: {
        "Variable Name": "RAIN_72hr",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 2.9,
        "Minimum Value": 0,
        "Average Value": 0.6125535714285714,
        "Unique Values": 25,
        "Zero Count": 15,
        "Median Value": 0.222,
        "Data Range": 2.9,
        "A-D Statistics": 4.407839074398439,
        "A-D Stat P-Value": 0.005522321355258097,
        "Mean Value": 0.6125535714285714,
        "Standard Deviation": 0.7691099429034571,
        Variance: 0.5915301042729592,
        Kurtosis: 1.7213188683361382,
        Skewness: 1.5882314105521447,
    },
    BIRDS: {
        "Variable Name": "BIRDS",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 3845,
        "Minimum Value": 8,
        "Average Value": 271.8392857142857,
        "Unique Values": 49,
        "Zero Count": 0,
        "Median Value": 79,
        "Data Range": 3837,
        "A-D Statistics": 13.630932925498115,
        "A-D Stat P-Value": 4.684030940893535e-13,
        "Mean Value": 271.8392857142857,
        "Standard Deviation": 645.4385767164645,
        Variance: 416590.95631377544,
        Kurtosis: 16.407892575977378,
        Skewness: 3.975142507173309,
    },
    HUMANS: {
        "Variable Name": "HUMANS",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 8803,
        "Minimum Value": 3,
        "Average Value": 715.0535714285714,
        "Unique Values": 51,
        "Zero Count": 0,
        "Median Value": 145.5,
        "Data Range": 8800,
        "A-D Statistics": 10.871964718366968,
        "A-D Stat P-Value": 9.736417097006012e-7,
        "Mean Value": 715.0535714285714,
        "Standard Deviation": 1566.7266652350925,
        Variance: 2454632.443558674,
        Kurtosis: 12.895233781490779,
        Skewness: 3.525340209088456,
    },
    WAVE_HEIGHT: {
        "Variable Name": "WAVE_HEIGHT",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 1.219,
        "Minimum Value": 0,
        "Average Value": 0.25725,
        "Unique Values": 18,
        "Zero Count": 11,
        "Median Value": 0.152,
        "Data Range": 1.219,
        "A-D Statistics": 3.724773898496238,
        "A-D Stat P-Value": 0.011897478426890373,
        "Mean Value": 0.25725,
        "Standard Deviation": 0.2990789581603589,
        Variance: 0.08944822321428572,
        Kurtosis: 1.5103101954251335,
        Skewness: 1.487880522090612,
    },
    WIND_DIRECTION: {
        "Variable Name": "WIND_DIRECTION",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 325.7,
        "Minimum Value": 32.5,
        "Average Value": 186.56607142857143,
        "Unique Values": 56,
        "Zero Count": 0,
        "Median Value": 186,
        "Data Range": 293.2,
        "A-D Statistics": 0.12115166248798204,
        "A-D Stat P-Value": 0.9997796385069385,
        "Mean Value": 186.56607142857143,
        "Standard Deviation": 60.79824150648283,
        Variance: 3696.426170280612,
        Kurtosis: -0.12295747401125912,
        Skewness: -0.056578144314575224,
    },
    AIR_TEMP: {
        "Variable Name": "AIR_TEMP",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 26.5,
        "Minimum Value": 14.6,
        "Average Value": 21.325,
        "Unique Values": 48,
        "Zero Count": 0,
        "Median Value": 21.7,
        "Data Range": 11.9,
        "A-D Statistics": 0.4517760931447441,
        "A-D Stat P-Value": 0.7962768602458957,
        "Mean Value": 21.325,
        "Standard Deviation": 2.924786316981123,
        Variance: 8.554375000000002,
        Kurtosis: -0.48267002004013904,
        Skewness: -0.3630645228055377,
    },
    WIND_SPEED: {
        "Variable Name": "WIND_SPEED",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 33.8,
        "Minimum Value": 1.4,
        "Average Value": 11.994642857142859,
        "Unique Values": 45,
        "Zero Count": 0,
        "Median Value": 10.85,
        "Data Range": 32.4,
        "A-D Statistics": 0.6161912359830168,
        "A-D Stat P-Value": 0.6328241930441432,
        "Mean Value": 11.994642857142859,
        "Standard Deviation": 6.462817266123661,
        Variance: 41.76800701530612,
        Kurtosis: 0.9780482461314146,
        Skewness: 0.865192186583406,
    },
    DOC: {
        "Variable Name": "DOC",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 76.08,
        "Minimum Value": 2.029,
        "Average Value": 8.5725,
        "Unique Values": 56,
        "Zero Count": 0,
        "Median Value": 2.9105,
        "Data Range": 74.051,
        "A-D Statistics": 10.960598161409962,
        "A-D Stat P-Value": 7.65412954906175e-7,
        "Mean Value": 8.5725,
        "Standard Deviation": 14.013698504881368,
        Variance: 196.3837457857143,
        Kurtosis: 9.681113056887334,
        Skewness: 3.064901910090408,
    },
    UV_254: {
        "Variable Name": "UV_254",
        "Variable Type": "numeric",
        "Row Count": 56,
        "Maximum Value": 1.225,
        "Minimum Value": 0.026,
        "Average Value": 0.6629464285714286,
        "Unique Values": 55,
        "Zero Count": 0,
        "Median Value": 0.746,
        "Data Range": 1.199,
        "A-D Statistics": 1.4643681069714347,
        "A-D Stat P-Value": 0.1852164874651684,
        "Mean Value": 0.6629464285714286,
        "Standard Deviation": 0.33760016606942306,
        Variance: 0.11397387213010203,
        Kurtosis: -0.8612234174630125,
        Skewness: -0.48746732069270965,
    },
    PAR: {
        "Variable Name": "PAR",
        "Variable Type": "numeric",
        "Row Count": 43,
        "Maximum Value": 793.7,
        "Minimum Value": 46.2,
        "Average Value": 455.0372093023256,
        "Unique Values": 43,
        "Zero Count": 0,
        "Median Value": 531.2,
        "Data Range": 747.5,
        "A-D Statistics": 1.0474298618295066,
        "A-D Stat P-Value": 0.33331849094358623,
        "Mean Value": 455.0372093023256,
        "Standard Deviation": 220.42199804039294,
        Variance: 48585.85722011899,
        Kurtosis: -1.2646608416529512,
        Skewness: -0.23453493967401615,
    },
    RH: {
        "Variable Name": "RH",
        "Variable Type": "numeric",
        "Row Count": 55,
        "Maximum Value": 98.1,
        "Minimum Value": 62.5,
        "Average Value": 84.67454545454544,
        "Unique Values": 50,
        "Zero Count": 0,
        "Median Value": 86.6,
        "Data Range": 35.599999999999994,
        "A-D Statistics": 0.8356096280463134,
        "A-D Stat P-Value": 0.45604884394211453,
        "Mean Value": 84.67454545454544,
        "Standard Deviation": 8.178402115146014,
        Variance: 66.88626115702479,
        Kurtosis: -0.1608939694762368,
        Skewness: -0.670643843512563,
    },
    A_Comp_24: {
        "Variable Name": "A_Comp_24",
        "Variable Type": "numeric",
        "Row Count": 46,
        "Maximum Value": 0.206347321,
        "Minimum Value": -0.270253827,
        "Average Value": -0.041889239608695644,
        "Unique Values": 46,
        "Zero Count": 0,
        "Median Value": -0.028945712499999998,
        "Data Range": 0.476601148,
        "A-D Statistics": 0.2305320687665997,
        "A-D Stat P-Value": 0.9797197864336162,
        "Mean Value": -0.041889239608695644,
        "Standard Deviation": 0.09769884540183721,
        Variance: 0.009545064392852088,
        Kurtosis: -0.13416700104835355,
        Skewness: -0.10646072490344284,
    },
    O_Comp_24: {
        "Variable Name": "O_Comp_24",
        "Variable Type": "numeric",
        "Row Count": 46,
        "Maximum Value": 0.096761932,
        "Minimum Value": -0.101629005,
        "Average Value": 0.013252289869565219,
        "Unique Values": 46,
        "Zero Count": 0,
        "Median Value": 0.0124609855,
        "Data Range": 0.198390937,
        "A-D Statistics": 0.7241321618403163,
        "A-D Stat P-Value": 0.539012128267681,
        "Mean Value": 0.013252289869565219,
        "Standard Deviation": 0.0373766508657801,
        Variance: 0.0013970140299424199,
        Kurtosis: 1.423961857392726,
        Skewness: -0.4564289740580131,
    },
};
