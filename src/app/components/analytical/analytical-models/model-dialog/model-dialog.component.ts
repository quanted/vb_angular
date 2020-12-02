import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-model-dialog',
  templateUrl: './model-dialog.component.html',
  styleUrls: ['./model-dialog.component.css']
})
export class ModelDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModelDialogComponent>) { }

  ngOnInit(): void {}


  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
}
