import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  panelOpenState = false;
  projectID;
  project = {};
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.projectID = this.route.snapshot.paramMap.get('id');
    this.projectService.getProjects().subscribe(projects => {
      this.project = projects.find(project => {
        // tslint:disable-next-line:triple-equals
        return project.id == this.projectID;
      });
    });
  }
}
