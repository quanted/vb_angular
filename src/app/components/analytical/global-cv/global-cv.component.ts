import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PipelineInfoModel} from '../../../models/pipeline-info.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('cvPipeInfo') && changes.hasOwnProperty('pipelines')) {
      if (!changes.cvPipeInfo.firstChange && !changes.pipelines.firstChange) {
        this.setFormControls();
        this.cvFormGroup?.disable();
      }
    }
    /*
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
    */
  }

  /**
   *
   */
  setFormControls() {
    // First check if cv
    const cv = this.pipelines.find(pipeline => {
      return pipeline.type === 'cvpipe';
    });
    console.log(this.cvPipeInfo);

    // Create controls but set values of controls to cv values else set to default
    const control = this.cvFormGroup?.controls.formControls as FormArray;

    if (cv === undefined) {
      this.cvPipeInfo?.['hyper-parameters'].forEach(param => {
        const newGroup = this.formBuilder.group({
          [param.name]: [param.value]
        });
        control.push(newGroup);
      });
    } else {
      // Parse strings into objects
      // cv.metadata = JSON.parse(cv.metadata);
      // Assign value to form fields
      this.cvPipeInfo?.['hyper-parameters'].forEach(param => {
        const newGroup = this.formBuilder.group({
          [param.name]: [cv.metadata.hyper_parameters[`${param.name}`]]
        });
        control.push(newGroup);
      });
    }
  }

  /**
   * Getter
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
      const max = Number(splits[1]) + 1;
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
      this.cvFormGroup.disable();
    }
    this.disabled = !this.disabled;
  }

  /**
   *
   */
  createCV() {
    let cv = this.pipelines.find(pipeline => {
      return pipeline.type === 'cvpipe';
    });

    // Create new cvpipe pipeline if one is not in pipelines
    if (cv === undefined) {
      cv = {
        name: 'cvpipe',
        description: 'cvpipe',
        project: `${this.projectID}`,
        type: 'cvpipe',
        metadata: {
          hyper_parameters: {},
          estimators: []
        }
      };

      // Add default hyper parameters from cvpipeinfo
      this.cvPipeInfo?.['hyper-parameters'].forEach(param => {
        cv.metadata.hyper_parameters[`${param.name}`] = param.value;
      });

      // Work around for error for this default value
      cv.metadata.hyper_parameters['scorer_list'] = 'neg_mean_absolute_error';

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
      cv.metadata.estimators = JSON.parse(cv.metadata.estimators.replace(/'/g, '"'));
      cv.metadata.hyper_parameters = JSON.parse(cv.metadata.hyper_parameters.replace(/'/g, '"'));
      console.log(cv);

      // Get type/hyperparams of each pipeline and append array of objects
      const estimatorObj = [];
      this.pipelines.forEach(pipeline => {
        if (pipeline.type !== 'cvpipe') {
          estimatorObj.push({
            type: pipeline.type,
            hyper_parameters: JSON.parse(pipeline.metadata.hyper_parameters.replace(/'/g, '"'))
          });
        }
      });

      cv.metadata.estimators = estimatorObj;

      // Get hyperparams from cvFormGroup
      const hyperParams = this.cvFormGroup.getRawValue();//.controls.formControls as FormArray
      console.log(hyperParams);
      if (hyperParams.controls.length > 0) {
        console.log("here");
        // Get each formgroup in the hyperparams formarray and add values to object..
        const hyperParamsObj = {};
        for (const control of hyperParams.controls) {
          const key = Object.entries(control.value)?.toString().split(',');
          hyperParamsObj[`${key[0]}`] = key[1];
        }

        // Assign hyperparams object to cv hyper_parameters
        cv.metadata.hyper_parameters = hyperParamsObj;
        cv.metadata.hyper_parameters['scorer_list'] = 'neg_mean_squared_error';
      }

      /*
      // Stringify
      cv.metadata = JSON.stringify(cv.metadata);
      console.log(cv);
      // Issue with updating a cv pipeline, so delete and make a new one.
      // this.pipelineService.deletePipeline(cv.id).subscribe();
      this.pipelineService.updatePipeline(cv, cv.id).subscribe(res => {
        console.log(res);
      });
       */
  }
}
