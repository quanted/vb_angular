import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/services/dataset.service';
import { LocationService } from 'src/app/services/location.service';
import { PipelineService } from 'src/app/services/pipeline.service';

import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  panelOpenState = false;
  
  @Input() project;
  @Output() projectDeleted: EventEmitter<any> = new EventEmitter<any>();

  locationName = '';
  datasetName = '';
  pipelines = [];

  pipelineUpdateTimer;
  pipelinesStatusMessage = 'No pipelines';
  hasDashboard = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private locationService: LocationService,
    private datasetService: DatasetService,
    private pipelineService: PipelineService
  ) { }

  ngOnInit(): void {
    this.locationService.getLocations().subscribe(locations => {
      for (let location of locations) {
        if (location.id === this.project.location) {
          this.locationName = location.name;
        }
      }
    });
    if (this.project.dataset) {
      this.datasetService.getDataset(this.project.dataset).subscribe(dataset => {
        this.datasetName = dataset.name;
      })
    }
    this.updatePipelines();
    this.pipelineUpdateTimer = setInterval(() => {
      this.updatePipelines();
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.pipelineUpdateTimer);
  }

  editProject(project) {
    this.router.navigateByUrl(`project/${project.id}`);
  }

  gotoDashboard(project) {
    this.router.navigateByUrl(`dashboard/${project.id}`);
  }

  cloneProject(project) {
    console.log("project cloning not implemented yet!");
  }
  
  deleteProject(project) {
    this.projectService.deleteProject(project.id).subscribe(() => {
      this.projectDeleted.emit();
    });
  }

  updatePipelines() {
    this.pipelineService.getProjectPipelines(this.project.id).subscribe((pipelines) => {
      if (pipelines.length > 0){ 
        this.pipelines = [...pipelines];
        let pipelinesCompleted = true;
        for (let pipeline of this.pipelines) {
          let pipelineStatus = pipeline.metadata.status;
          if (pipelineStatus !== "Completed and model saved") {
            pipelinesCompleted = false;
          }
        }
        if (pipelinesCompleted) {
          this.hasDashboard = true;
          clearInterval(this.pipelineUpdateTimer);}
        }
      }
    )
  }

  cancelPipeline(): void {
    console.log("cancel pipeline not implemented");
  }
}
