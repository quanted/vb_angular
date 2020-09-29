import { Component, OnInit } from "@angular/core";
import { DatasetService } from "src/app/services/dataset.service";

import * as XLSX from "xlsx";

type AOA = any [][];

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.css"],
})
export class DataComponent implements OnInit {
  columnData = [];
  columnNames = [];

  constructor(private dataService: DatasetService) {}

  ngOnInit() {}

  onFileChange($event) {
    console.log("onFileChange()!");
    const target: DataTransfer = <DataTransfer>($event.target);
    if (target.files.length !== 1) {
      console.log("XLSX can only load one file at a time");
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));

      this.columnNames = data[0];
      const columnValues = data.slice(1);
      for (let i = 0; i < columnValues.length; i++) {
        const record = {};
        const values = columnValues[i];
        for (let j = 0; j < this.columnNames.length; j++) {
          record[this.columnNames[j]] = values[j];
        }
        this.columnData.push(record);
      }
      console.log("onFileChange: ", this.columnNames);
      console.log("onFileChange: ", this.columnData);

    }
    reader.readAsBinaryString(target.files[0]);
  }
}
