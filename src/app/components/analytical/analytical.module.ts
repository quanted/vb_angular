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
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IconsModule } from '../icons/icons.module';
import { ModelDialogComponent } from './analytical-models/model-dialog/model-dialog.component';

@NgModule({
  declarations: [
    AnalyticalComponent, 
    AnalyticalModelsComponent,
    CreateModelComponent,
    ModelDialogComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule, 
    ReactiveFormsModule,
    IconsModule
  ],
  exports: [
    AnalyticalComponent
  ]
})
export class AnalyticalModule { }
