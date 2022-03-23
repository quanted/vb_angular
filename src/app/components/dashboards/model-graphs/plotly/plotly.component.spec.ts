import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvYhatVsY1Component } from './plotly';

describe('CvYhatVsY1Component', () => {
  let component: CvYhatVsY1Component;
  let fixture: ComponentFixture<CvYhatVsY1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CvYhatVsY1Component]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvYhatVsY1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
