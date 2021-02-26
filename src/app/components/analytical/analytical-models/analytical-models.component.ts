import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { PipelineService } from '../../../services/pipeline.service';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModelDialogComponent } from './model-dialog/model-dialog.component';
import {PipelineModel} from '../../../models/pipeline.model';
import {MatTableDataSource} from '@angular/material/table';

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
  pipelines: PipelineModel[];
  dataSource: MatTableDataSource<PipelineModel>;
  @Output() pipelinesUpdated = new EventEmitter<PipelineModel[]>();

  // Column names displayed on table that shows the models
  columnsToDisplay: string[] = [
    'name',
    'action'
  ];

  // State variable for opening closing table elements on click
  expandedElement: PipelineModel | null;

  constructor(
    private route: ActivatedRoute,
    private pipelineService: PipelineService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.modelFormGroup = this.formBuilder.group({
      descriptionCtrl: [''],
    });
    this.getPipelines(this.route.snapshot.paramMap.get('id'));
  }

  getPipelines(projectID: string) {
    this.pipelineService.getProjectPipelines(projectID).subscribe(pipelines => {
      this.dataSource = new MatTableDataSource(pipelines);
      this.pipelinesUpdated.emit(pipelines);
    });
  }

  openDialog(obj): void {
    const dialogRef = this.dialog.open(ModelDialogComponent, {
      width: '250px',
      data: obj
    });
  }
}
