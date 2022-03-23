import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashpanelComponent } from './dashpanel.component';

describe('DashpanelComponent', () => {
  let component: DashpanelComponent;
  let fixture: ComponentFixture<DashpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashpanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
