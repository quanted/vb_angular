import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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

  pipelines = [];
  hasDashboard = true;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private pipelineService: PipelineService
  ) { }

  ngOnInit(): void {
    this.pipelineService.getProjectPipelines(this.project.id).subscribe((pipelines) => {
      this.pipelines = [...pipelines];
      for (let pipeline of this.pipelines) {
        this.pipelineService.getPipelineStatus(this.project.id, pipeline.id).subscribe((status) => {
          pipeline['status'] = status.metadata;
        })
      }
    })
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

  cancelPipeline(): void {
    console.log("cancel pipeline not implemented");
  }
}
