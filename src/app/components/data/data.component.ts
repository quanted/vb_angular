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
  @Input() datasetID;
  datasetForm: FormGroup;

  datasets = [];
  dataset;
  
  dataCSV = '';
  dataArray = [];
  columnData = [];
  columnNames = [];
  
  creatingDataset = false;

  dv = [];

  generateAO = false;

  @Output() setDataset: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private dataService: DatasetService, 
    private fb: FormBuilder
    ) {}

  ngOnInit() {
    this.dataService.getDatasets().subscribe(datasets => {
      this.datasets = [...datasets];
    });

    if (this.datasetID) {
      this.dataService.getDataset(this.datasetID).subscribe((dataset) => {
        this.dataset = dataset;
        this.setDataset.emit(dataset);
      })
    }
    
    this.datasetForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      startRow: [null, Validators.required],
      totalRows: [null],
      endRow: [null, Validators.required],
      target: [null, Validators.required],
      features: [null, Validators.required],
      speed: [null],
      magnatude: [null],
    });
  }

  selectData(dataset) {
    this.dataService.getDataset(dataset.id).subscribe((dataset) => {
      this.setDataset.emit(dataset);
      this.dataset = dataset;
    })
  }

  selectAllRows(): void {
    this.datasetForm.get('startRow').setValue(0);
    this.datasetForm.get('endRow').setValue(this.columnData.length - 1);
    this.datasetForm.get('totalRows').setValue(this.columnData.length);
  }

  selectRows(): void {
    if (this.datasetForm.get('startRow').valid && this.datasetForm.get('endRow').valid) {
      const totalRows = this.datasetForm.get('endRow').value - this.datasetForm.get('startRow').value + 1;
      this.datasetForm.get('totalRows').setValue(totalRows);
    }
  }

  clearSelectedRows(): void {
    this.datasetForm.get('startRow').setValue(null);
    this.datasetForm.get('endRow').setValue(null);
    this.datasetForm.get('totalRows').setValue(null);
  }

  createDataset(): void {
    console.log(this.datasetForm.value);
    if (this.datasetForm.valid) {
      const newDataset = {
        name: this.datasetForm.get('name').value,
        description: this.datasetForm.get('description').value,
        data: this.dataCSV
      }
  
      if (this.generateAO) {
        newDataset['metadata'] = JSON.stringify(
          {
            target: this.datasetForm.get('target').value,
            features: this.datasetForm.get('features').value,
            wind: { 
              speed: this.datasetForm.get('speed').value, 
              magnatude: this.datasetForm.get('magnatude').value
            }
          })
      } else {
        newDataset['metadata'] = JSON.stringify(
          {
            target: this.datasetForm.get('target').value,
            features: this.datasetForm.get('features').value
          })
      }
      console.log(newDataset);
      console.log('form valid!')

      this.dataService.createDataset(newDataset).subscribe((dataset) => {
        this.dataService.getDatasets().subscribe((datasets) => {
          this.datasets = [...datasets];
          this.cancel();
        })
      });
    } else {
      console.log('form invalid!');
    }
  }

  deleteData(dataset): void {
    this.dataService.deleteDataset(dataset).subscribe(() => {
      this.dataService.getDatasets().subscribe((datasets) => {
        this.datasets = [...datasets];
      })
    })
  }

  cancel(): void {
    this.dataCSV = '';
    this.dataArray = [];
    this.columnData = [];
    this.columnNames = [];
    this.dv = []
    this.datasetForm.reset();
    this.creatingDataset = false;
  }

  updateInputs(varSet, value) {
    let inputIV = document.getElementById(value + "IV");
    let inputDV = document.getElementById(value + "DV");
    let inputA = document.getElementById(value + "A");
    let inputO = document.getElementById(value + "O");
    switch(varSet) {
      case "IV":
        this.datasetForm.get('target').setValue(value);
        inputDV["checked"] = false;
        this.dv = this.dv.filter((val) => {
          return val != value;
        });
        this.datasetForm.get('features').setValue(this.dv);
        if (inputA) {
          inputA["checked"] = false;
          if (value === this.datasetForm.get('speed').value){
            this.datasetForm.get('speed').setValue(null);
          }
        }
        if (inputO) {
          inputO["checked"] = false;
          if (value === this.datasetForm.get('magnatude').value){
            this.datasetForm.get('magnatude').setValue(null);
          }
        }
        break;
      case "DV":
        inputIV["checked"] = false;
        if (value === this.datasetForm.get('target').value){
          this.datasetForm.get('target').setValue(null);
        }
        if (inputDV["checked"] === false) {
          this.dv = this.dv.filter((val) => {
            return val != value;
          })
        } else {
          if (!this.dv.includes(value)) {
            this.dv.push(value);
          }
        }
        this.datasetForm.get('features').setValue(this.dv);
        if (inputA) {
          inputA["checked"] = false;
          if (value === this.datasetForm.get('speed').value){
            this.datasetForm.get('speed').setValue(null);
          }
        }
        if (inputO) {
          inputO["checked"] = false;
          if (value === this.datasetForm.get('magnatude').value){
            this.datasetForm.get('magnatude').setValue(null);
          }
        }
        break;
      case "A":
        inputIV["checked"] = false;
        if (value === this.datasetForm.get('target').value){
          this.datasetForm.get('target').setValue(null);
        }
        inputDV["checked"] = false;
        this.dv = this.dv.filter((val) => {
          return val != value;
        });
        this.datasetForm.get('features').setValue(this.dv);
        this.datasetForm.get('speed').setValue(value);
        if (inputO) {
          inputO["checked"] = false;
          if (value === this.datasetForm.get('magnatude').value){
            this.datasetForm.get('magnatude').setValue(null);
          }
        }
        break;
      case "O":
        inputIV["checked"] = false;
        if (value === this.datasetForm.get('target').value){
          this.datasetForm.get('target').setValue(null);
        }
        inputDV["checked"] = false;
        this.dv = this.dv.filter((val) => {
          return val != value;
        });
        this.datasetForm.get('features').setValue(this.dv);
        if (inputA) {
          inputA["checked"] = false;
          if (value === this.datasetForm.get('speed').value){
            this.datasetForm.get('speed').setValue(null);
          }
        }
        this.datasetForm.get('magnatude').setValue(value);
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
    this.datasetForm.get('name').setValue(target.files[0].name);
    this.creatingDataset = true;
  }

  toggle() {
    this.generateAO = !this.generateAO;
    if(!this.generateAO) {
      this.datasetForm.get('speed').setValue(null);
      this.datasetForm.get('magnatude').setValue(null);
    }
  }
}
