import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "src/app/services/auth.service";

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
    private auth: AuthService) {}

  userIsAuthenticated(): boolean {
    return this.auth.userIsAuthenticated();
  }

  ngOnInit() {
    console.log("HOME>>>>:init");
    this.statusMessage = '';
    
    this.projects = [];
    this.projectService.getProjects().subscribe((projects) => {
      if (!projects.error) {
        if (projects.length < 1) {
          this.statusMessage = "You have no stored projects";
        } else {
          this.projects = [...projects];
        }
      } else {
        console.log(projects.error);
      }
    });
  }
  
  createProject(): void {
    this.router.navigateByUrl("create-project");
  }

  projectDeleted(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = [...projects];
    });
  }
}
