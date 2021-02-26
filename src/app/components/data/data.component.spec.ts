import {ComponentFixture, TestBed } from '@angular/core/testing';
import { DataComponent } from './data.component';
import { HttpClientTestingModule, HttpTestingController } 
    from '@angular/common/http/testing';

describe('DataComponent', () => {
  let component: DataComponent;
  let fixture: ComponentFixture<DataComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ DataComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
