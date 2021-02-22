import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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

  panelOpenState = false;
  // FormGroups
  resamplingApproachFormGroup: FormGroup;
  pipelineFormGroup: FormGroup;

  @Output() sendMessage = new EventEmitter();
  pipelineInfo: PipelineInfoModel[];

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private pipelineService: PipelineService
  ) {}

  ngOnInit() {
    // Get the pipeline info and populate necessary fields.
    this.getPipelineInfo();
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

  estimatorChange(e): void {
    this.pipelineFormGroup.controls.pipelineNameCtrl.setValue(e.source.triggerValue);
    this.pipelineFormGroup.controls.pipelineDescCtrl.setValue(
      this.pipelineInfo.find(pipeline => e.source.triggerValue === pipeline.name).description
    );
  }

  addPipeline() {
    const newPipeline: PipelineModel = {
      project: this.route.snapshot.paramMap.get('id'),
      name: this.pipelineFormGroup.controls.pipelineNameCtrl.value,
      type: '',
      description: this.pipelineFormGroup.controls.pipelineDescCtrl.value,
    };
    newPipeline.type = this.pipelineInfo.find(pipeline => {
      return this.pipelineFormGroup.controls.estimatorCtrl.value === pipeline.name;
    }).ptype;
    this.pipelineService.addPipeline(newPipeline).subscribe();
    this.sendMessage.next();
  }
}
