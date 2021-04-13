import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PipelineInfoModel} from '../../../models/pipeline-info.model';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {PipelineService} from '../../../services/pipeline.service';
import {PipelineModel} from '../../../models/pipeline.model';

@Component({
  selector: 'app-global-cv',
  templateUrl: './global-cv.component.html',
  styleUrls: ['./global-cv.component.css']
})
export class GlobalCvComponent implements OnInit, OnChanges {

  @Input() projectID;
  @Input() cvPipeInfo: PipelineInfoModel;
  @Input() pipelines: PipelineModel[];
  cvFormGroup: FormGroup;
  disabled = true;

  constructor(
    private formBuilder: FormBuilder,
    private pipelineService: PipelineService,
  ) { }

  ngOnInit(): void {
    this.cvFormGroup = this.formBuilder.group({
      formControls: new FormArray([])
    });
  }

  /**
   * When @Input changes, this function is called by Angular.
   * @param changes - contains property names of @Input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'cvPipeInfo': {
            this.setFormControls();
            this.cvFormGroup?.disable();
            break;
          }
          case 'pipelines': {
            if (!changes[propName].firstChange) {
             this.createCV();
            }
            break;
          }
        }
      }
    }
  }


  /**
   *
   */
  setFormControls() {
    // First check if cv
    const cv = {...this.pipelines.find(pipeline => {
      return pipeline.type === 'vbhelper';
    })};

    // Create controls but set values of controls to cv values else set to default
    const control = this.cvFormGroup?.controls.formControls as FormArray;

    // Check if cv is empty
    if (Object.keys(cv).length === 0) {
      // cv is empty {}, generate forms with default values from cvPipeInfo
      this.cvPipeInfo?.['hyper-parameters'].forEach(param => {
        const newGroup = this.formBuilder.group({
          [param.name]: [param.value]
        });
        control.push(newGroup);
      });
    } else {
      // cv is not empty
      // Check that type of hyper_parameters is string before parsing.
      if (typeof cv.metadata.hyper_parameters === 'string') {
        cv.metadata.hyper_parameters = JSON.parse(cv.metadata.hyper_parameters.replace(/'/g, '"'));
      }
      // Assign value to form fields from cv values
      this.cvPipeInfo?.['hyper-parameters'].forEach(param => {
        const newGroup = this.formBuilder.group({
          [param.name]: [cv.metadata.hyper_parameters[`${param.name}`]]
        });
        control.push(newGroup);
      });
    }
  }

  /**
   * Getter used in HTML for generating the forms.
   */
  get hyperParams(): FormArray {
    return this.cvFormGroup.get('formControls') as FormArray;
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

  /**
   *
   */
  toggleCV() {
    if (this.disabled) {
      this.cvFormGroup.enable();
    } else {
      this.createCV();
      this.cvFormGroup.disable();
    }
    this.disabled = !this.disabled;
  }

  /**
   *
   */
  createCV() {
    let cv = {...this.pipelines.find(pipeline => {
      return pipeline.type === 'vbhelper';
    })};

    // Create new vbhelper pipeline if one is not in pipelines
    if (Object.keys(cv).length === 0) {
      cv = {
        name: 'vbhelper',
        description: 'vbhelper',
        project: `${this.projectID}`,
        type: 'vbhelper',
        metadata: {
          hyper_parameters: {},
          estimators: [{
            type: '',
            hyper_parameters: {}
          }]
        }
      };

      // Add default hyper parameters from cvpipeinfo
      this.cvPipeInfo?.['hyper-parameters'].forEach(param => {
        cv.metadata.hyper_parameters[`${param.name}`] = param.value;
      });

      // Stringify
      cv.metadata = JSON.stringify(cv.metadata);

      // Create
      this.pipelineService.addPipeline(cv).subscribe(response => {
          console.log(response);
        }
      );
    } else {
      this.updateCVPipe(cv);
    }
  }

  /**
   *
   */
  updateCVPipe(cv) {
      // Get type/hyperparams of each pipeline and append array of objects
      const estimatorObj = [];

      if (this.pipelines.length > 1) {
        this.pipelines.forEach(pipeline => {
          if (pipeline.type !== 'vbhelper') {
            estimatorObj.push({
              type: pipeline.type,
              hyper_parameters: JSON.parse(pipeline.metadata.hyper_parameters.replace(/'/g, '"'))
            });
          }
        });
      } else {
        estimatorObj.push({
          type: '',
          hyper_parameters: {}
        });
      }

      cv.metadata.estimators = estimatorObj;

      // Get hyperparams from cvFormGroup
      const hyperParams = this.cvFormGroup.controls.formControls as FormArray;
      if (hyperParams.controls.length > 0) {
        // Get each formgroup in the hyperparams formarray and add values to object..
        const hyperParamsObj = {};
        for (const control of hyperParams.controls) {
          const key = Object.entries(control.value)?.toString().split(',');
          hyperParamsObj[`${key[0]}`] = key[1];
        }

        // Assign hyperparams object to cv hyper_parameters
        cv.metadata.hyper_parameters = hyperParamsObj;
      }

      // Stringify
      cv.metadata = JSON.stringify(cv.metadata).replace(/'/g, '\"');
      cv.metadata = cv.metadata.replace(/ /g, '');
      cv.metadata = cv.metadata.replace(/"{/, '{');
      cv.metadata = cv.metadata.replace(/}"/, '}');

      const data = new FormData();
      data.append('project', cv.project);
      data.append('description', cv.description);
      data.append('type', cv.type);
      data.append('name', cv.name);
      data.append('metadata', cv.metadata);

      this.pipelineService.updatePipelineXHR(data, cv.id);
  }
}
