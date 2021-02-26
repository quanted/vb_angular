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

  project;
  location;
  locationName = 'No location selected';
  dataset;
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
      const projectID = this.route.snapshot.paramMap.get('id');
      this.projectService.getProjects().subscribe((projects) => {
        this.project = projects.find((project) => {
          return project.id == projectID;
        });
      });
    }
  }

  setLocation(location): void {
    this.locationName = location.name;
    this.project.location = location.id;
    
    const update = {...this.project};
    update.metadata = JSON.stringify(this.project.metadata);
    this.projectService.updateProject(update).subscribe((project) => {
      // project location_id updated
    })
  }

  setDataset(dataset): void {
    this.datasetName = dataset.name;
    this.project.dataset = dataset.id;
    this.project['metadata'] = {...dataset.metadata};

    const update = {...this.project};
    update['metadata'] = JSON.stringify({...dataset.metadata});
    this.projectService.updateProject(update).subscribe((project) => {
      // project metadata updated
    })
  }

  setPipelines(pipelines): void {
    this.pipelines = [...pipelines];
    const typeList = [];
    for (let pipeline of pipelines) {
      typeList.push(pipeline.type);
    }
    this.pipelineNames = typeList.join(', ');
  }

  executeProject(): void {
    for (let pipeline of this.pipelines) {
      this.pipelineService.executePipeline(this.project, pipeline.id)
      .subscribe((response) => {
        console.log('pipeline ' + pipeline.id + ' response: ', response );
      });
    }
  }
}
