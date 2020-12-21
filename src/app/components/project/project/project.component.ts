import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocationData } from 'src/app/models/location-data';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  panelOpenState = false;

  project_ID: string;
  project;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    if(this.route.paramMap) {
      this.project_ID = this.route.snapshot.paramMap.get('id');
      this.projectService.getProjects().subscribe((projects) => {
        this.project = projects.find((project) => {
          return project.id == this.project_ID;
        });
      });
    }
  }
}
