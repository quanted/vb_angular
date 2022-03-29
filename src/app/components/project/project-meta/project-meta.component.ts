import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-project-meta',
  templateUrl: './project-meta.component.html',
  styleUrls: ['./project-meta.component.css']
})
export class ProjectMetaComponent implements OnInit {
  @Input() projectMetadata = {};
  formCompleted: BehaviorSubject<any>;

  projectMetadataForm: FormGroup;

  statusMessage: string = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.projectMetadataForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
    this.formCompleted = new BehaviorSubject<any>(null);
  }

  sendForm() {
    if (this.projectMetadataForm.valid) {
      this.formCompleted.next(this.projectMetadataForm.value);
    } else {
      this.statusMessage = 'Name and description are required';
    }
  }

  cancel(): void {
    this.formCompleted.next(null);
  }

}
