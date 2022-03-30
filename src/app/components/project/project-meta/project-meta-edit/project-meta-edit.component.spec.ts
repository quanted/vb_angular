import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetaEditComponent } from './project-meta-edit.component';

describe('ProjectMetaEditComponent', () => {
  let component: ProjectMetaEditComponent;
  let fixture: ComponentFixture<ProjectMetaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMetaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMetaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
