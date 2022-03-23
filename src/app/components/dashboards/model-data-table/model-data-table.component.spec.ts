import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDataTableComponent } from './model-data-table.component';

describe('ModelDataTableComponent', () => {
  let component: ModelDataTableComponent;
  let fixture: ComponentFixture<ModelDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
