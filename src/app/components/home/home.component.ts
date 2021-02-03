import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProjectModel} from '../../models/project.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  username = '';
  statusMessage = '';
  projects = [];
  projectFormGroup: FormGroup;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Init forms
    this.projectFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.username = this.authService.getUsername();
    this.projectService.getProjects().subscribe(projects => {
      if (!projects.error) {
        if (projects.length < 1) {
          this.statusMessage = 'You have no stored projects';
        } else {
          this.projects = projects;
        }
      } else {
        console.log(projects.error);
      }
    });
  }

  deleteProject(project): void {
    this.projectService.deleteProject(project.id).subscribe(() => {
      this.projectService.getProjects().subscribe(projects => {
        if (!projects.error) {
          if (projects.length < 1) {
            this.statusMessage = 'You have no stored projects';
            this.projects = [];
          } else {
            this.projects = projects;
          }
        } else {
          console.log(projects.error);
        }
      });
    });
  }

  gotoProject(project) {
    this.router.navigateByUrl(`project/${project.id}`);
  }

  addProject(): void {
    if (this.projectFormGroup.valid) {
      this.projectService.addProject(this.projectFormGroup.value)
        .subscribe(project => {
        this.router.navigateByUrl(`project/${project.id}`);
      });
    }
  }
}
