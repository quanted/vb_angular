import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSelectionModelTableComponent } from './model-selection-model-table.component';

describe('ModelSelectionModelTableComponent', () => {
  let component: ModelSelectionModelTableComponent;
  let fixture: ComponentFixture<ModelSelectionModelTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelSelectionModelTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelSelectionModelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
