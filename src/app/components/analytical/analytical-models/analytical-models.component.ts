import {Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PipelineService} from '../../../services/pipeline.service';
import {ActivatedRoute} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PipelineModel} from '../../../models/pipeline.model';
import {MatTableDataSource} from '@angular/material/table';
import {PipelineInfoModel} from '../../../models/pipeline-info.model';

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
export class AnalyticalModelsComponent implements OnInit, OnChanges {

  @Input() vbHelper: any;
  @Input() pipelineInfo: any;
  pipelines: any;
  dataSource: MatTableDataSource<any>;
  // State management variables for Advanced options expansion panel.
  panelOpenState = false;
  hasHyperParams = false;
  disabled = true;
  // Form Groups
  pipelineFormGroup: FormGroup;
  selectedPipeline: PipelineInfoModel;
  selectedPipelineOptions: [];

  // Column names displayed on table that shows the models
  columnsToDisplay: string[] = [
    'name'
  ];

  // State variable for opening closing table elements on click
  expandedElement: any | null;

  constructor(
    private route: ActivatedRoute,
    private pipelineService: PipelineService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = this.vbHelper.metadata.estimators;
  }

  ngOnInit(): void {
    this.pipelineFormGroup = this.formBuilder.group({
      estimatorCtrl: ['', Validators.required],
      pipelineNameCtrl: [''],
      pipelineDescCtrl: [''],
      hyperParamCtrl: new FormArray([])
    });
    this.dataSource = this.vbHelper.metadata.estimators;
    this.pipelineFormGroup.disable();
  }

  setFormControls(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement !== null) {
      // Set the selected pipeline.
      this.selectedPipeline = this.pipelineInfo.find(pipeline => {
        return this.expandedElement.name === pipeline.name;
      });
      this.pipelineFormGroup.controls.estimatorCtrl.setValue(this.expandedElement.name);
      this.pipelineFormGroup.controls.pipelineNameCtrl.setValue(this.expandedElement.name);
      this.pipelineFormGroup.controls.pipelineDescCtrl.setValue(this.expandedElement.description);
      // Clear form array
      const control = this.pipelineFormGroup.controls.hyperParamCtrl as FormArray;
      control.clear();
      // Check for hyper params
      if (this.expandedElement.parameters.length < 1) {
        // No hyper params, removed advanced section.
        this.hasHyperParams = false;
      } else {
        // Has hyper params, add advanced section and create form array.
        this.hasHyperParams = true;
        for (const key in this.expandedElement.parameters) {
          const newGroup = this.formBuilder.group({
            [key]: [this.expandedElement.parameters[key]]
          });
          control.push(newGroup);
        }
      }
      this.pipelineFormGroup.disable();
    }
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
      const splits = options.split(':', 2);
      const min = Number(splits[0]);
      const max = splits[1] === 'inf' ? 100 : Number(splits[1]) + 1;
      for (let i = min; i < max; i++) {
        result.push(i.toString());
      }
    } else if (options.includes(':') && options.includes('.')) {
      // Allocate range of float values
      const splits = options.split(':', 2);
      const min = Number.parseFloat(splits[0]);
      const max = Number.parseFloat(splits[1]);
      for (let i = min; i < max; i += 0.1) {
        result.push(i.toPrecision(1).toString());
      }
    } else if (options.includes(',') && options.includes('.')) {
      // Allocate range of float values
      const splits = options.split(',', 2);
      const min = Number.parseFloat(splits[0]);
      const max = Number.parseFloat(splits[1]);
      for (let i = min; i < max; i += 0.1) {
        result.push(i.toPrecision(1).toString());
      }
    } else {
      // Allocate string parameters options
      options = options.replace(/[\[\]']+/g, '');
      options = options.replace('\'', ' ');
      result = options.split(/\s*,\s*/);
    }
    return result;
  }

  toggleCV(val) {
    if (this.disabled) {
      this.pipelineFormGroup.enable();
    } else {
      if (val === 'save') {
        // save pipeline
      } else if (val === 'delete') {
        // delete pipeline
      }
      this.pipelineFormGroup.disable();
    }
    this.disabled = !this.disabled;
  }
}
