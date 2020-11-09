import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticalModelsComponent } from './analytical-models.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AnalyticalModelsComponent', () => {
  let component: AnalyticalModelsComponent;
  let fixture: ComponentFixture<AnalyticalModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticalModelsComponent ],
      imports: [ HttpClientTestingModule ]
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
