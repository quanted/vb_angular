import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutePipelinesComponent } from './execute-pipelines.component';

describe('ExecutePipelinesComponent', () => {
  let component: ExecutePipelinesComponent;
  let fixture: ComponentFixture<ExecutePipelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutePipelinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutePipelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
