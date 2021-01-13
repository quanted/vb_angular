import {Component, OnInit, QueryList, ViewChild, ViewChildren, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {AnalyticalModelResponse} from '../../../models/analytical-model-response';
import {AnalyticalModelService} from '../../../services/analyticalmodel.service';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.css']
})
export class CreateModelComponent implements OnInit {

  isLinear = false;
  resamplingApproachFormGroup: FormGroup;
  nameFormGroup: FormGroup;
  selectDataFormGroup: FormGroup;
  methodFormGroup: FormGroup;
  types: string[] = ['Linear Regression', 'Histogram Gradient Boosting', 'L1 Least-angle Regression'];
  vars: string[] = ['mpg', 'cyl', 'displ', 'hp', 'weight', 'accel', 'yr', 'origin', 'name'];
  @ViewChild('selectAll') private selectAllCheckbox: MatCheckbox;
  @ViewChildren('checkboxes') private checkboxes: QueryList<MatCheckbox>;
  @Output() sendMessage = new EventEmitter();
  model: AnalyticalModelResponse;

  constructor(private formBuilder: FormBuilder, private analyticalService: AnalyticalModelService) {}

  ngOnInit() {
    this.resamplingApproachFormGroup = this.formBuilder.group({
      gridpointsCtrl: ['5'],
      cvFoldsCtrl: ['5'],
      cvRepsCtrl: ['3'],
      cvGroupCountCtrl: ['5'],
      cvStrategyCtrl: ['Quantile'],
      bootStrategyCtrl: ['Linear Regression']
    });
    /*
    this.nameFormGroup = this.formBuilder.group({
      nameCtrl: ['', Validators.required],
    });
     */
    this.selectDataFormGroup = this.formBuilder.group({
      dependantVar: ['', Validators.required],
      independentVars: ['']
    });
    this.methodFormGroup = this.formBuilder.group({
      estimators: this.formBuilder.array([this.estimators])
    });
  }


  /* Get Methods */
  get estimators(): FormGroup {
    return this.formBuilder.group({
      nameCtrl: ['', Validators.required],
      estimatorSelect: ['', Validators.required],
      imputationCtrl: ['Impute this'],
      featureCtrl: ['Feature this'],
      inputs: new FormArray([this.inputs])
    });
  }

  get inputs(): FormGroup {
    return this.formBuilder.group({
      input: ['', Validators.required]
    });
  }
  /**********/

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

  onChangeEstimator(e) {
    const estimator = e.source.value ?? '';
  }

  addMethod() {
    (this.methodFormGroup.get('estimators') as FormArray).push(this.estimators);
  }

  runModel(e) {
    this.model = {
      dependantVariable: '',
      description: '',
      estimators: [],
      independentVariables: [''],
      name: this.nameFormGroup.controls.nameCtrl.value,
      project: '',
      type: '',
      variables: ''
    };

    this.sendMessage.next(this.model);
  }
}
