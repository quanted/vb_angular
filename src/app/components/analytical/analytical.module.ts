import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticalComponent } from "./analytical.component";
import { AnalyticalModelsComponent } from './analytical-models/analytical-models.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSelectModule } from "@angular/material/select";
import { CreateModelComponent } from './create-model/create-model.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  declarations: [
    AnalyticalComponent, 
    AnalyticalModelsComponent,
    CreateModelComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports: [
    AnalyticalComponent
  ]
})
export class AnalyticalModule { }
