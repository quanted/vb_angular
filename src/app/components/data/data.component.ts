import { Component, OnInit } from "@angular/core";
import { DatasetService } from "src/app/services/dataset.service";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.css"],
})
export class DataComponent implements OnInit {
  files: FileList;
  data;

  constructor(private dataService: DatasetService) {}

  ngOnInit() {}

  updateFileList(event): void {
    this.files = event.target.files;
  }

  uploadSourceFile(): void {
    if (this.files.length === 0) {
      console.log("no files selected!");
      return;
    }
    for (let f = 0; f < this.files.length; f++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (reader.result) {
          this.data = reader.result;
          this.parseCSV(this.data);
        } else {
          // error messages here?
        }
      };
      reader.readAsText(this.files[f]);
    }
  }

  parseCSV(data) {
    const lines = data.split("\n");
    for (const line of lines) {
      console.log("line: ", line);
    }
  }
}
