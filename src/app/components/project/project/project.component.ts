import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PipelineService } from 'src/app/services/pipeline.service';

import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  panelOpenState = false;

  projectID: string;
  project;
  locationID;
  locationName = 'No location selected';
  datasetID;
  datasetName = 'No data selected';
  pipelines = [];
  pipelineNames = 'No pipelines selected';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private pipelineService: PipelineService
  ) { }

  ngOnInit(): void {
    if(this.route.paramMap) {
      this.projectID = this.route.snapshot.paramMap.get('id');
      this.projectService.getProjects().subscribe((projects) => {
        this.project = projects.find((project) => {
          return project.id == this.projectID;
        });
      });
    }
  }

  setLocation(location): void {
    this.locationID = location.id;
    this.locationName = location.name;
  }

  setDataset(dataset): void {
    this.datasetID = dataset.id;
    this.datasetName = dataset.name;
  }

  setPipelines(pipelines): void {
    this.pipelines = [...pipelines];
    this.pipelineNames = '';
    for (let pipeline of pipelines) {
      this.pipelineNames += (pipeline.name + ' ');
    }
  }

  executeProject(): void {
    for (let pipeline of this.pipelines) {
      this.pipelineService.executePipeline(this.projectID, this.locationID, this.datasetID, pipeline.id)
      .subscribe((response) => {
        console.log('pipeline ' + pipeline.id + ' response: ', response );
      });
    }
  }
}
