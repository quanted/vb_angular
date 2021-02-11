import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  statusMessage: string;

  projects;

  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.statusMessage = '';
    
    this.projects = [];
    this.projectService.getProjects().subscribe((projects) => {
      if (!projects.error) {
        if (projects.length < 1) {
          this.statusMessage = "You have no stored projects";
        } else {
          this.projects = projects;
        }
      } else {
        console.log(projects.error);
      }
    });
  }
  
  createProject(): void {
    console.log("createing new project");
    this.router.navigateByUrl("map");
  }
}
