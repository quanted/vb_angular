import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCreateComponent } from './data-create.component';

describe('DataCreateComponent', () => {
  let component: DataCreateComponent;
  let fixture: ComponentFixture<DataCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
