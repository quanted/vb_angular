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

  setIV(variable) {
    this.iv = variable;
    if (this.dv.includes(variable)) {
      this.dv = this.dv.filter((v1) => {
        return v1 != variable;
      });
    }
  }

  addDV(variable) {
    if (!this.dv.includes(variable)) {
      this.dv.push(variable);
    }
  }

  setA(variable) {
    this.a = variable;
    if (this.dv.includes(variable)) {
      this.dv = this.dv.filter((v1) => {
        return v1 != variable;
      });
    }
  }

  setO(variable) {
    this.o = variable;
    if (this.dv.includes(variable)) {
      this.dv = this.dv.filter((v1) => {
        return v1 != variable;
      });
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
    //
  }
}
