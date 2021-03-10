import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PipelineService} from '../../../services/pipeline.service';
import {PipelineInfoModel} from '../../../models/pipeline-info.model';
import {PipelineModel} from '../../../models/pipeline.model';
import {ActivatedRoute} from '@angular/router';
import {split} from 'ts-node';

@Component({
  selector: 'app-create-pipeline',
  templateUrl: './create-pipeline.component.html',
  styleUrls: ['./create-pipeline.component.css']
})
export class CreatePipelineComponent implements OnInit {

  // State management variables for Advanced options expansion panel.
  panelOpenState = false;
  hasHyperParams = false;
  // Form Groups
  pipelineFormGroup: FormGroup;

  @Input() projectID;
  @Input() pipelineInfo: PipelineInfoModel[];
  @Output() pipelineCreated = new EventEmitter();
  @Output() pipelineCancelled = new EventEmitter();
  selectedPipeline: PipelineInfoModel;
  selectedPipelineOptions: [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private pipelineService: PipelineService
  ) {}

  ngOnInit() {
    this.pipelineFormGroup = this.formBuilder.group({
      estimatorCtrl: ['', Validators.required],
      pipelineNameCtrl: [''],
      pipelineDescCtrl: [''],
      hyperParamCtrl: new FormArray([])
    });
  }

  /**
   * Getter
   */
  get hyperParams(): FormArray {
    return this.pipelineFormGroup.get('hyperParamCtrl') as FormArray;
  }

  /**
   * Changes the pipeline name/description fields with default info when user
   * selects a different pipeline option and changes the advanced options form inputs.
   * @param e - Event object sent by the HTML input.
   */
  estimatorChange(e): void {
    // Get the selected pipeline.
    this.selectedPipeline = this.pipelineInfo.find(pipeline => {
      return e.source.triggerValue === pipeline.name;
    });
    // Update name and description with defaults.
    this.pipelineFormGroup.controls.pipelineNameCtrl.setValue(this.selectedPipeline.name);
    this.pipelineFormGroup.controls.pipelineDescCtrl.setValue(this.selectedPipeline.description);

    // Clear form array
    const control = this.pipelineFormGroup.controls.hyperParamCtrl as FormArray;
    control.clear();
    // Check for hyper params
    if (this.selectedPipeline['hyper-parameters'].length < 1) {
      // No hyper params, removed advanced section.
      this.hasHyperParams = false;
    } else {
      // Has hyper params, add advanced section and create form array.
      this.hasHyperParams = true;
      this.selectedPipeline['hyper-parameters'].forEach(param => {
        const newGroup = this.formBuilder.group({
          [param.name]: [param.value]
        });
        control.push(newGroup);
      });
    }
  }

  /**
   *
   */
  getHyperParamOptions(options: string): string[] {
    let result: string[] = [];

    // Check for range of integer values.
    if (options.includes(':') && !options.includes('.')) {
      // Allocate array of value range.
      const min = Number(options.charAt(0));
      const max = Number(options.charAt(options.length - 1)) + 1;
      for (let i = min; i < max; i++) {
        result.push(i.toString());
      }
    } else if (options.includes(':') && options.includes('.')) {
      // Allocate range of float values
    } else {
      // Allocate string parameters options
      options = options.replace(/[\[\]']+/g, '');
      options = options.replace('\'', ' ');
      result = options.split(/\s*,\s*/);
    }
    return result;
  }

  /**
   * Function that adds a new pipeline to the users project.
   */
  addPipeline() {
    const hyperParams = this.pipelineFormGroup.controls.hyperParamCtrl as FormArray;
    // Populate a pipeline object.
    const newPipeline: PipelineModel = {
      project: this.projectID,
      name: this.pipelineFormGroup.controls.pipelineNameCtrl.value,
      type: this.pipelineInfo.find(pipeline => {
        return this.pipelineFormGroup.controls.estimatorCtrl.value === pipeline.name;
      }).ptype,
      description: this.pipelineFormGroup.controls.pipelineDescCtrl.value,
      metadata: ''
    };
    // Get each formgroup and add values to object..
    const obj = {};
    for (const control of hyperParams.controls) {
      const key = Object.entries(control.value)?.toString().split(',');
      obj[`${key[0]}`] = key[1];
    }
    // Endpoint only accepts metadata as a string with only double quotes allowed
    // and no escape characters. Stringify object and assign value to metadata.
    newPipeline.metadata = `{"hyper_parameters":${JSON.stringify(obj)}}`
      .replace(/'/g, '\"');
    // Add pipeline
    this.pipelineService.addPipeline(newPipeline).subscribe((response) => {
      this.pipelineCreated.emit();
    });
  }

  cancelPipeline() {
    this.pipelineCancelled.emit();
  }
}
