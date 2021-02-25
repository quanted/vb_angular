import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
  @Input() datasetID;
  creatingDataset = false;
  dataset;

  rowsForm: FormGroup;
  nameForm: FormGroup;

  generateAO = false;
  iv;
  dv = [];
  speed;
  magnatude;
  selectedRows = [];
  totalRows = 0;

  @Output() setDataset: EventEmitter<any> = new EventEmitter<any>();
  dataCSV = '';
  dataArray = [];
  columnData = [];
  columnNames = [];

  constructor(
    private dataService: DatasetService, 
    private fb: FormBuilder
    ) {}

  ngOnInit() {
    this.dataService.getDatasets().subscribe(datasets => {
      this.datasets = [...datasets];
      for (let dataset of datasets) {
        if (dataset.id === this.datasetID) {
          this.dataset = dataset;
          this.setDataset.emit(dataset);
        }
      }
    });
    
    this.nameForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
    
    this.rowsForm = this.fb.group({
      startRow: [null, Validators.required],
      endRow: [null, Validators.required],
    });
  }

  selectData(dataset) {
    this.setDataset.emit(dataset);
    this.dataset = dataset;
  }

  selectAllRows(): void {
    this.selectedRows = [];
    this.addRange(
      {
        start: 0,
        end: this.columnData.length - 1
      });
    this.rowsForm.setValue({
      startRow: 0,
      endRow: this.columnData.length - 1
    })
  }

  selectRows(): void {
    if (this.rowsForm.valid) {
      const start = this.rowsForm.get('startRow').value;
      const end = this.rowsForm.get('endRow').value;
      if (start >= 0 && start < end && end < this.columnData.length - 1) {
        let newRange = {
          start,
          end
        }
        this.addRange(newRange);
      }
    }
  }

  clearSelectedRows(): void {
    this.selectedRows = [];
    this.rowsForm.get('startRow').setValue(null);
    this.rowsForm.get('endRow').setValue(null);
    this.totalRows = 0;
  }

  addRange(range) {
    this.selectedRows = [];
    this.selectedRows.push(range);
    this.totalRows = 0;
    for (let range of this.selectedRows) {
      this.totalRows += (range.end - range.start + 1);
    }
  }

  createDataset(): void {
    const newDataset = {
      name: this.nameForm.get('name').value,
      description: this.nameForm.get('description').value,
      data: this.dataCSV,
      metadata: JSON.stringify({
        target: this.iv,
        features: this.dv,
        wind: { 
          speed: this.speed || null, 
          magnatude: this.magnatude || null
        }
      })
    }
    console.log('newDataset: ', newDataset);
    this.dataService.createDataset(newDataset).subscribe((newDataset) => {
      this.dataService.getDatasets().subscribe((datasets) => {
        this.datasets = [...datasets];
      })
      this.dataset = newDataset;
    });
  }

  deleteData(dataset): void {
    this.dataService.deleteDataset(dataset).subscribe(() => {
      this.dataService.getDatasets().subscribe((datasets) => {
        this.datasets = [...datasets];
      })
    })
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
          if (value === this.speed){
            this.speed = "";
          }
        }
        if (inputO) {
          inputO["checked"] = false;
          if (value === this.magnatude){
            this.magnatude = "";
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
          if (value === this.speed){
            this.speed = "";
          }
        }
        if (inputO) {
          inputO["checked"] = false;
          if (value === this.magnatude){
            this.magnatude = "";
          }
        }
        break;
      case "A":
        this.speed = value;
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
            if (value === this.magnatude){
              this.magnatude = "";
            }
          }
        }
        break;
      case "O":
        this.magnatude = value;
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
            if (value === this.speed){
              this.speed = "";
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

      this.dataArray = XLSX.utils.sheet_to_json(ws, {header: 1});
      this.dataCSV = XLSX.utils.sheet_to_csv(ws);

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
    }
    reader.readAsBinaryString(target.files[0]);
    this.setDataset.emit(target.files[0].name);
    this.nameForm.get('name').setValue(target.files[0].name);
    this.creatingDataset = true;
  }

  toggle() {
    this.generateAO = !this.generateAO;
  }
}
