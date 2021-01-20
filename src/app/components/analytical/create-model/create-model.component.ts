import {Component, OnInit, QueryList, ViewChild, ViewChildren, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {AnalyticalModelResponse} from '../../../models/analytical-model-response';
import {AnalyticalModelService} from '../../../services/analyticalmodel.service';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.css']
})
export class CreateModelComponent implements OnInit {

  isLinear = false;
  resamplingApproachFormGroup: FormGroup;
  selectDataFormGroup: FormGroup;
  pipelineFormGroup: FormGroup;
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
      bootStrategyCtrl: ['None'],
      bootRepsCtrl: ['3']
    });
    this.selectDataFormGroup = this.formBuilder.group({
      dependantVar: ['', Validators.required],
      independentVars: ['']
    });
    this.pipelineFormGroup = this.formBuilder.group({
      estimatorCtrl: ['', Validators.required],
      pipelineNameCtrl: [''],
      pipelineDescCtrl: ['']
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
  }

  runModel(e) {
    this.sendMessage.next(this.model);
  }
}
