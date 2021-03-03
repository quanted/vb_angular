import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private pipelineService: PipelineService
  ) { }
  
  userIsAuthenticated(): boolean {
    if(!this.auth.userIsAuthenticated()) {
      this.router.navigateByUrl("/");
      return false;
    }
    return true;
  }

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

  // js is weird
  // console.log(+[++[[]][+[]]+[[][[]]+[]][+[]][++[++[++[[]][+[]]][+[]]][+[]]]+[++[[]][+[]]]+[+[]]+[+[]]+[+[]]][+[]]); ?

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
      console.log(`project ${this.project.id} executing pipeline ${pipeline.id} on dataset ${this.project.dataset}`);
      this.pipelineService.executePipeline(this.project, pipeline.id)
      .subscribe((response) => {
        this.router.navigateByUrl('');
      });
    }
  }
}
