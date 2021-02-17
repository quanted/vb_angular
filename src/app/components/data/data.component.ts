import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { DatasetService } from "src/app/services/dataset.service";

import * as XLSX from "xlsx";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit {
  datasets;
  dataset = false;

  generateAO = false;
  iv;
  dv = [];
  a;
  o;
  startRow = 0;
  endRow = 0;
  totalRows = 0;

  @Output() dataFile: EventEmitter<any> = new EventEmitter<any>();
  importedData = [];
  columnData = [];
  columnNames = [];

  constructor(private dataService: DatasetService) {}

  ngOnInit() {
    this.dataService.getDatasets().subscribe(datasets => {
      console.log("datasets: ", datasets);
      // this.datasets = {...datasets};
      this.datasets = ["set1", "set2", "set3"];
    });
  }

  selectData(dataset) {
    // this.dataService.getDataset(dataset.id).subscribe(dataset => {
    //   console.log("dataset: ", dataset);
    //   this.dataset = dataset;
    //   this.dataFile.emit(dataset);
    // })
    this.dataFile.emit(dataset);
    this.dataset = dataset;
  }

  updateInputs(varSet, value) {
    let inputIV = document.getElementById(value + "IV");
    let inputDV = document.getElementById(value + "DV");
    let inputA = document.getElementById(value + "A");
    let inputO = document.getElementById(value + "O");
    switch(varSet) {
      case "IV":
        this.iv = value;
        inputDV["checked"] = false;
        this.dv = this.dv.filter((val) => {
          return val != value;
        });
        if (inputA) {
          inputA["checked"] = false;
          if (value === this.a){
            this.a = "";
          }
        }
        if (inputO) {
          inputO["checked"] = false;
          if (value === this.o){
            this.o = "";
          }
        }
        break;
      case "DV":
        if (inputDV["checked"] === false) {
          this.dv = this.dv.filter((val) => {
            return val != value;
          })
        } else {
          if (!this.dv.includes(value)) {
            this.dv.push(value);
          }
        }
        inputIV["checked"] = false;
        if (value === this.iv){
          this.iv = "";
        }
        if (inputA) {
          inputA["checked"] = false;
          if (value === this.a){
            this.a = "";
          }
        }
        if (inputO) {
          inputO["checked"] = false;
          if (value === this.o){
            this.o = "";
          }
        }
        break;
      case "A":
        this.a = value;
        inputIV["checked"] = false;
        if (value === this.iv){
          this.iv = "";
        }
        inputDV["checked"] = false;
        this.dv = this.dv.filter((val) => {
          return val != value;
        });
        if (inputO) {
          if (inputO["checked"]) {
            inputO["checked"] = false;
            if (value === this.o){
              this.o = "";
            }
          }
        }
        break;
      case "O":
        this.o = value;
        inputIV["checked"] = false;
        if (value === this.iv){
          this.iv = "";
        }
        inputDV["checked"] = false;
        this.dv = this.dv.filter((val) => {
          return val != value;
        });
        if (inputA) {
          if (inputA["checked"]) {
            inputA["checked"] = false;
            if (value === this.a){
              this.a = "";
            }
          }
        }
        break;
      default:
        console.log(`ERROR: invalid input! ${varSet} | ${value}`);
    }
  }

  onFileChange($event) {
    const target: DataTransfer = <DataTransfer>($event.target);
    if (target.files.length !== 1) {
      console.log('XLSX can only load one file at a time');
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.importedData = (XLSX.utils.sheet_to_json(ws, {header: 1}));

      this.columnNames = this.importedData[0];
      const columnValues = this.importedData.slice(1);
      for (let i = 0; i < columnValues.length; i++) {
        const record = {};
        const values = columnValues[i];
        for (let j = 0; j < this.columnNames.length; j++) {
          record[this.columnNames[j]] = values[j];
        }
        this.columnData.push(record);
        this.dataset = true;
      }
      this.totalRows = this.columnData.length;
      this.endRow = this.totalRows - 1;
    }
    reader.readAsBinaryString(target.files[0]);
    this.dataFile.emit(target.files[0].name);
  }

  toggle() {
    this.generateAO = !this.generateAO;
  }

  saveDataset(): void {
    // this.dataService.saveDataset().subscribe();
  }
}
