import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.css"],
})
export class DataComponent implements OnInit {
  files: FileList;
  data;

  constructor() {}

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
        } else {
          // error messages here?
        }
      };
      reader.readAsText(this.files[f]);
    }
  }
}
