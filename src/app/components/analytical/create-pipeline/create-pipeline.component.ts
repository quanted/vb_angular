import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PipelineService} from '../../../services/pipeline.service';
import {PipelineInfoModel} from '../../../models/pipeline-info.model';
import {PipelineModel} from '../../../models/pipeline.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create-pipeline',
  templateUrl: './create-pipeline.component.html',
  styleUrls: ['./create-pipeline.component.css']
})
export class CreatePipelineComponent implements OnInit {

  // State management variable for Advanced options expansion panel.
  panelOpenState = false;
  hasHyperParams = false;
  // FormGroups
  advancedOptionsFormGroup: FormGroup;
  pipelineFormGroup: FormGroup;

  @Input() projectID;
  @Output() pipelineCreated = new EventEmitter();
  pipelineInfo: PipelineInfoModel[];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private pipelineService: PipelineService
  ) {}

  ngOnInit() {
    // Get the pipeline info and populate necessary fields.
    this.getPipelineInfo();
    this.advancedOptionsFormGroup = this.formBuilder.group({});
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
    this.pipelineService.getPipelines().subscribe(pipelines => {
      this.pipelineInfo = pipelines;
    });
  }

  /**
   * Changes the pipeline name/description fields with default info when user
   * selects a different pipeline option and changes the advanced options form inputs.
   * @param e - Event object sent by the HTML input.
   */
  estimatorChange(e): void {
    // Get the selected pipeline.
    const selectedPipeline = this.pipelineInfo.find(pipeline => {
      return e.source.triggerValue === pipeline.name;
    });
    // Update name and description with defaults.
    this.pipelineFormGroup.controls.pipelineNameCtrl.setValue(selectedPipeline.name);
    this.pipelineFormGroup.controls.pipelineDescCtrl.setValue(selectedPipeline.description);

    /*
    // Remove controls from advanced options form.
    Object.keys(this.advancedOptionsFormGroup.controls).forEach((key) => {
      this.advancedOptionsFormGroup.removeControl(key);
    });
    // Add new controls
    selectedPipeline.hyperParameters.forEach(param => {
      this.advancedOptionsFormGroup.addControl(param.name,
        this.formBuilder.control([param.value, Validators.required]));
    });
     */
  }

  /**
   * Function that adds a new pipeline to the users project.
   */
  addPipeline() {
    // Populate a pipeline object.
    const newPipeline: PipelineModel = {
      project: this.projectID,
      name: this.pipelineFormGroup.controls.pipelineNameCtrl.value,
      type: this.pipelineInfo.find(pipeline => {
        return this.pipelineFormGroup.controls.estimatorCtrl.value === pipeline.name;
      }).ptype,
      description: this.pipelineFormGroup.controls.pipelineDescCtrl.value
    };

    /*
    // Check if Hyper params exist
    if (Object.keys(this.advancedOptionsFormGroup.controls).length > 0) {
      // Push hyper param to array of params
      Object.keys(this.advancedOptionsFormGroup.controls).forEach(key => {
        newPipeline.hyperParameters.push({
          name: this.advancedOptionsFormGroup.controls.key.value,
          value: ''
        });
      });
    }
    */

    // Add pipeline
    this.pipelineService.addPipeline(newPipeline).subscribe((response) => {
      this.pipelineCreated.emit();
    });
  }
}
