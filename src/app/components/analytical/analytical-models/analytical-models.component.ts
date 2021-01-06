import { Component, OnInit, Input } from '@angular/core';
import { AnalyticalModelService } from '../../../services/analyticalmodel.service';
import { AnalyticalModelResponse, mockModel } from '../../../models/analytical-model-response';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModelDialogComponent } from './model-dialog/model-dialog.component';

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

  display: boolean;
  modelFormGroup: FormGroup;

  // Holds models returned for project Id by the AnalyticalModelService
  models: AnalyticalModelResponse[] = [];

  // Column names displayed on table that shows the models
  columnsToDisplay: string[] = [
    'name',
    'type',
    'action'
  ];

  // State variable for opening closing table elements on click
  expandedElement: AnalyticalModelResponse | null;

  constructor(
    private route: ActivatedRoute,
    private analyticalModelService: AnalyticalModelService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.modelFormGroup = this.formBuilder.group({
      descriptionCtrl: [''],
    });
    // this.getModels(this.route.snapshot.paramMap.get('id'));
    this.getModels('1');
  }

  getModels(projectID: string): void {
    if (projectID === 'undefined' || projectID === 'null') {
      this.display = true;
    } else {
      this.analyticalModelService.getModels(projectID).subscribe(model => {
        this.models = model;
        console.log(this.models);
      });
      if (this.models.length === 0) {
        this.display = true;
      }
    }
  }

  openDialog(obj): void {
    const dialogRef = this.dialog.open(ModelDialogComponent, {
      width: '250px',
      data: obj
    });
  }
}
