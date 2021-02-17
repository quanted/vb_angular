import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  panelOpenState = false;
  
  @Input() project;

  status = "working..."
  hasDashboard = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
  }

  deleteProject(project) {
    console.log("delete project: ", project);
    this.projectService.deleteProject(project.id).subscribe();
    this.router.navigateByUrl('');
  }

  editProject(project) {
    console.log("edit project: ", project);
    this.router.navigateByUrl(`project/${project.id}`);
  }

  cloneProject(project) {
    console.log("project cloning not implemented yet!");
  }

  gotoDashboard(project) {
    this.router.navigateByUrl(`dashboard/${project.id}`);
  }
}
