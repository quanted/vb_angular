import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  statusMessage = '';
  projectForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  createProject() {
    if (this.projectForm.valid) {
      this.projectService
        .createProject({
            name: this.projectForm.get('name').value,
            description: this.projectForm.get('description').value
        })
        .subscribe((project) => {
          if (project.error) {
            this.statusMessage = project.error;
          }
          this.router.navigateByUrl(`project/${project.id}`);
        });
    } else {
      this.statusMessage = 'Name and description are required';
    }
  }

  cancel() {
    this.router.navigateByUrl("home");
  }
}
