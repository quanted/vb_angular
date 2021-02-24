import {Component, Input, OnInit} from '@angular/core';
import {PipelineService} from '../../../services/pipeline.service';
import {PipelineModel} from '../../../models/pipeline.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-execute-pipelines',
  templateUrl: './execute-pipelines.component.html',
  styleUrls: ['./execute-pipelines.component.css']
})
export class ExecutePipelinesComponent implements OnInit {

  @Input() pipelines: PipelineModel[];
  @Input() datasetID: number;

  constructor(
    private pipelineService: PipelineService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Function that executes the pipelines for a project.
   * Iterates through an array of pipelines then navigates to the home page.
   */
  execute(): void {
    this.pipelines.forEach(pipeline => {
      this.pipelineService.execute(pipeline, this.datasetID).subscribe(response => {
        console.log(response);
      });
    });
    this.router.navigateByUrl('');
  }
}
