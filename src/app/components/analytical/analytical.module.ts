import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticalComponent } from "./analytical.component";
import { AnalyticalModelsComponent } from './analytical-models/analytical-models.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [AnalyticalComponent, AnalyticalModelsComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [
    AnalyticalComponent
  ]
})
export class AnalyticalModule { }
