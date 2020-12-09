import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.css']
})
export class CreateModelComponent implements OnInit {

  isLinear = false;
  nameFormGroup: FormGroup;
  selectDataFormGroup: FormGroup;
  methodFormGroup: FormGroup;

  types : string[] = [
    "Linear Regression", 
    "Partial Least Squares", 
    "Gradient Boosting Machine"
  ];

  evaluationCriteria : String[] = [
    "Akaike Information Criterion (AIC)",
    "Corrected Akaike Information Criterion (AICC)",
    "R2",
    "Adjusted R2",
    "Predicted Error Sum of Squares (PRESS)",
    "Bayesian Information Criterion (BIC)",
    "RMSE",
    "Sensitivity",
    "Specificity",
    "Accuracy"
  ]

  randomVars : String[] = [
    "skeleton",
    "evaluate",
    "community",
    "star",
    "perfume",
    "abbey",
    "weak",
    "hardship",
    "habit",
    "unlawful"
  ]

  estimatorsJSON = {
    // Estimator is selected from a select dropdown of these top level variables.
    "Linear Regression" : {
      // Inputs with corresponding input types are dynamically displayed.
        "Evaluation Criteria" : {
          "inputType" : "select",
          "description" : "",
          "values" : [
            "Akaike Information Criterion (AIC)",
            "Corrected Akaike Information Criterion (AICC)",
            "R2",
            "Adjusted R2",
            "Predicted Error Sum of Squares (PRESS)",
            "Bayesian Information Criterion (BIC)",
            "RMSE",
            "Sensitivity",
            "Specificity",
            "Accuracy"
          ]
        }
    },
    "Partial Least Squares" : {

    },
    "Gradient Boosting Machine" : {

    }
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.nameFormGroup = this.formBuilder.group({
      nameCtrl: ['', Validators.required],
    });
    this.selectDataFormGroup = this.formBuilder.group({
      dependantVar: ['', Validators.required],
      independantVars: []
    });
    this.methodFormGroup = this.formBuilder.group({
      estimators: this.formBuilder.array([this.estimators])
    });
  }


  /* Get Methods */
  get estimators(): FormGroup {
    return this.formBuilder.group({
      estimatorSelect: ['', Validators.required],
      modelSearchSelect: ['', Validators.required],
      inputs: new FormArray([this.inputs])
    });
  }

  get inputs(): FormGroup {
    return this.formBuilder.group({
      input: ['', Validators.required]
    });
  }
  /**********/
  
  onChangeEstimator(e) {
    // Get estimator 
    let estimator : String = e.source.value ?? "";


    for(let element in this.estimatorsJSON[`${estimator}`]){
      
    }
  }

  addMethod() {
    (this.methodFormGroup.get("estimators") as FormArray).push(this.estimators);
  }

}
