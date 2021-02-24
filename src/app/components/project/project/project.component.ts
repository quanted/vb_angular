import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  locationName = 'No location selected';
  dataFileName = 'No data selected';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
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

  setLocationName(locationName): void {
    this.locationName = locationName;
  }

  setDataFileName(fileName): void {
    this.dataFileName = fileName;
  }
}
