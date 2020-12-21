import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  @Input() project;

  hasDashboard = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
  }

  deleteProject(project) {
    console.log("delete project: ", project);
  }

  editProject(project) {
    console.log("edit project: ", project);
    this.router.navigateByUrl(`project/${project.id}`);
  }

  gotoDashboard(project) {
    console.log("goto dashboard: ", project);
  }
}
