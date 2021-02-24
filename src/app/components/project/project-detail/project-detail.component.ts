import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() projectDeleted: EventEmitter<any> = new EventEmitter<any>();

  pipeline = {
    status:"working..."
  };
  hasDashboard = true;

  constructor(
    private router: Router,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
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

  
}
