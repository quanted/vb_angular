import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCvComponent } from './global-cv.component';

describe('GlobalCvComponent', () => {
  let component: GlobalCvComponent;
  let fixture: ComponentFixture<GlobalCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalCvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
