import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PipelineInfoModel} from '../../../models/pipeline-info.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PipelineService} from '../../../services/pipeline.service';

@Component({
  selector: 'app-global-cv',
  templateUrl: './global-cv.component.html',
  styleUrls: ['./global-cv.component.css']
})
export class GlobalCvComponent implements OnInit, OnChanges {

  @Input() cvPipeInfo: PipelineInfoModel;
  cvFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private pipelineService: PipelineService
  ) { }

  ngOnInit(): void {
    this.cvFormGroup = this.formBuilder.group({
      formControls: new FormArray([])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes.cvPipeInfo;
    if (!change.firstChange) {
      this.setFormControls();
    }
  }

  setFormControls() {
    const control = this.cvFormGroup.controls.formControls as FormArray;
    this.cvPipeInfo['hyper-parameters'].forEach(param => {
      const newGroup = this.formBuilder.group({
          [param.name]: [param.value]
        });
      control.push(newGroup);
      });
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
}
