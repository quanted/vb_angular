import { Component, OnInit } from '@angular/core';
import { AnalyticalModelService } from '../../../services/analyticalmodel.service';
import { AnalyticalModelResponse, mockModel } from '../../../models/analytical-model-response';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModelDialogComponent } from './model-dialog/model-dialog.component'
 
@Component({
  selector: 'app-analytical-models',
  templateUrl: './analytical-models.component.html',
  styleUrls: ['./analytical-models.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AnalyticalModelsComponent implements OnInit {

  modelFormGroup: FormGroup;

  // Holds models returned for project Id by the AnalyticalModelService
  models : AnalyticalModelResponse[] = [];

  // Column names displayed on table that shows the models
  columnsToDisplay: string[] = [
    'name', 
    'type',
    'action'
  ];

  // State variable for opening closing table elements on click
  expandedElement: AnalyticalModelResponse | null;

  constructor(
    private route : ActivatedRoute,
    private analyticalModelService : AnalyticalModelService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.modelFormGroup = this.formBuilder.group({
      descriptionCtrl: [''],
    });
    //this.getModels(this.route.snapshot.paramMap.get('id'));

    // Fake models for UI development
    for(let i = 0; i < 3; i++) {
      this.models.push({
        project : `${i}`,
        name : "myModel",
        type : "A Model Type",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        variables : "vars",
        model : "linear regression"
      });
    }
  }

  getModels(projectID : string) {
    if(projectID === "undefined" || projectID === "null") {
      console.log("No project ID");
    } else {
      this.analyticalModelService.getModels(projectID).subscribe(model => {
        this.models = model;
      });
    }
  }

  openDialog(obj) {
    const dialogRef = this.dialog.open(ModelDialogComponent, {
      width: '250px',
      data: obj
    });
  }
}
