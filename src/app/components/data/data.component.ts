import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatasetService } from "src/app/services/dataset.service";

import * as XLSX from "xlsx";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit {
  datasets = [];
  dataset = false;

  rowsForm: FormGroup;

  generateAO = false;
  iv;
  dv = [];
  a;
  o;
  startRow = 0;
  endRow = 0;
  selectedRows = [];
  totalRows = 0;

  @Output() dataFile: EventEmitter<any> = new EventEmitter<any>();
  importedData = [];
  columnData = [];
  columnNames = [];

  constructor(
    private dataService: DatasetService, 
    private fb: FormBuilder
    ) {}

  ngOnInit() {
    this.dataService.getDatasets().subscribe(datasets => {
      console.log("datasets: ", datasets);
      this.datasets = {...datasets};
      // this.datasets = ["set1", "set2", "set3"];
    });
    
    this.rowsForm = this.fb.group({
      startRow: [null, Validators.required],
      endRow: [null, Validators.required],
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

  selectAllRows(): void {
    this.selectedRows = [];
    this.addRange(
      {
        start: 0,
        end: this.columnData.length - 1
      });
  }

  selectRows(): void {
    if (this.rowsForm.valid) {
      let newRange = {
        start: this.rowsForm.get('startRow').value,
        end:  this.rowsForm.get('endRow').value,
      }

      if (newRange.end - newRange.start > 0) { // should probably do a custom formgroup validator
        let isNewRange = true;
        for (let range of this.selectedRows) {
          newRange.start < range.start && newRange.end > range.start? true : newRange.start = range.start;
          newRange.end > range.end && newRange.start < range.end? true : newRange.end = range.end;
          range.start = newRange.start;
          range.end = newRange.end;
        }
        if (isNewRange) {
          this.addRange(newRange);
        }
      }
    }
  }

  clearSelectedRows(): void {
    this.selectedRows = [];
    this.totalRows = 0;
  }

  addRange(range) {
    this.selectedRows.push(range);
    this.totalRows = 0;
    for (let range of this.selectedRows) {
      this.totalRows += (range.end - range.start);
    }
  }

  saveDataset(): void {
    // this.dataService.saveDataset().subscribe();
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
}
