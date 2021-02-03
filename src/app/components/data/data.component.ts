import { Component, OnInit } from '@angular/core';
import { DatasetService } from 'src/app/services/dataset.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit {
  importedData = [];
  columnData = [];
  columnNames = [];
  selectDataFormGroup: FormGroup;

  constructor(private dataService: DatasetService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.selectDataFormGroup = this.formBuilder.group({
      name: [null, Validators.required],
      data: [null, Validators.required],
      dependantVar: ['', Validators.required],
      independentVars: ['']
    });
  }

  onFileChange($event) {
    console.log('onFileChange()!');
    const target: DataTransfer = ($event.target) as DataTransfer;
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
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  saveDataset(): void {
    //
  }
}
