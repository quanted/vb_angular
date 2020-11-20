import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.css']
})
export class CreateModelComponent implements OnInit {

  isLinear = false;
  nameFormGroup: FormGroup;
  selectDataFormGroup: FormGroup;
  pipelineFormGroup: FormGroup;

  types : string[] = [
    "Linear Regression", 
    "Partial Least Squares", 
    "Gradient Boosting Machine"
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.nameFormGroup = this.formBuilder.group({
      nameCtrl: ['', Validators.required],
    });
    this.selectDataFormGroup = this.formBuilder.group({
      dataCtrl: ['', Validators.required]
    });
    this.pipelineFormGroup = this.formBuilder.group({
      typeCtrl: ['', Validators.required]
    });
  }

}
