import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelGraphsComponent } from './model-graphs.component';

describe('ModelGraphsComponent', () => {
  let component: ModelGraphsComponent;
  let fixture: ComponentFixture<ModelGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelGraphsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
