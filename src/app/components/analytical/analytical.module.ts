import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticalComponent } from "./analytical.component";
import { AnalyticalModelsComponent } from './analytical-models/analytical-models.component';

@NgModule({
  declarations: [AnalyticalComponent, AnalyticalModelsComponent],
  imports: [
    CommonModule
  ],
  exports: [
    AnalyticalComponent
  ]
})
export class AnalyticalModule { }
