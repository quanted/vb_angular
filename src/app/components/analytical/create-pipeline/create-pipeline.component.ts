import {Component, OnInit, QueryList, ViewChild, ViewChildren, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {PipelineService} from '../../../services/pipeline.service';
import {PipelineInfoModel} from '../../../models/pipeline-info.model';
import {PipelineModel} from '../../../models/pipeline.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-pipeline.component.html',
  styleUrls: ['./create-pipeline.component.css']
})
export class CreatePipelineComponent implements OnInit {

  isLinear = false;
  panelOpenState = false;
  // FormGroups
  resamplingApproachFormGroup: FormGroup;
  pipelineFormGroup: FormGroup;

  // Data
  vars: string[] = ['mpg', 'cyl', 'displ', 'hp', 'weight', 'accel', 'yr', 'origin', 'name'];
  @ViewChild('selectAll') private selectAllCheckbox: MatCheckbox;
  @ViewChildren('checkboxes') private checkboxes: QueryList<MatCheckbox>;
  //
  @Output() sendMessage = new EventEmitter();
  pipelineInfo: PipelineInfoModel[];
  pipelines: PipelineModel[];
  private group: any;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private pipelineService: PipelineService
  ) {}

  ngOnInit() {
    // Get the pipeline info and populate necessary fields.
    this.getPipelineInfo();
    this.getPipelines();
    this.resamplingApproachFormGroup = this.formBuilder.group({
      gridpointsCtrl: ['5'],
      cvFoldsCtrl: ['5'],
      cvRepsCtrl: ['3'],
      cvGroupCountCtrl: ['5'],
      cvStrategyCtrl: ['Quantile'],
      bootStrategyCtrl: ['None'],
      bootRepsCtrl: ['3']
    });
    this.pipelineFormGroup = this.formBuilder.group({
      estimatorCtrl: ['', Validators.required],
      pipelineNameCtrl: [''],
      pipelineDescCtrl: ['']
    });
  }

  /**
   * Calls the pipeline service to populate the "create pipeline" UI.
   */
  getPipelineInfo() {
    this.pipelineService.getPipelines().subscribe(pipeline => {
      this.pipelineInfo = pipeline;
    });
  }

  getPipelines() {
    const projectID = this.route.snapshot.paramMap.get('id');
    this.pipelineService.getPipelinesForProject(projectID).subscribe(pipelines => {
      this.pipelines = pipelines;
    });
  }

  onChangeDependantSelection(e) {
    const dependant = e.source.value ?? '';
    this.checkboxes.forEach(checkbox => {
      if (dependant === checkbox.value) {
        checkbox.disabled = true;
        checkbox.checked = false;
      } else {
        checkbox.disabled = false;
      }
    });
  }

  onSelectAll(e) {
    if (this.selectAllCheckbox.checked) {
      this.checkboxes.forEach(checkbox => {
        if (!checkbox.checked && !checkbox.disabled) {
          checkbox.checked = true;
        }
      });
    } else {
      this.checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          checkbox.checked = false;
        }
      });
    }
  }

  estimatorChange(e): void {
    this.pipelineFormGroup.controls.pipelineNameCtrl.setValue(e.source.triggerValue);
    this.pipelineFormGroup.controls.pipelineDescCtrl.setValue(
      this.pipelineInfo.find(pipeline => e.source.triggerValue === pipeline.name).description
    );
  }

  addPipeline() {
    let newPipeline: PipelineModel = {
      project: this.route.snapshot.paramMap.get('id'),
      name: this.pipelineFormGroup.controls.pipelineNameCtrl.value,
      type: 'enet',
      description: this.pipelineFormGroup.controls.pipelineDescCtrl.value,
    };
    // Get type
    /*
    newPipeline.type = this.pipelineInfo.find(pipeline => {
      return newPipeline.name === pipeline.name;
    }).pType;
    */
    this.pipelineService.addPipeline(newPipeline).subscribe();
  }
}
