import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticalModelsComponent } from './analytical-models.component';

describe('AnalyticalModelsComponent', () => {
  let component: AnalyticalModelsComponent;
  let fixture: ComponentFixture<AnalyticalModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticalModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticalModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
