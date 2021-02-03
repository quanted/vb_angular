import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticalModelsComponent } from './analytical-models.component';
import { PipelineService } from '../../../services/pipeline.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {AnalyticalModelResponse, mockModel} from '../../../models/analytical-model-response';

describe('AnalyticalModelsComponent', () => {
  let component: AnalyticalModelsComponent;
  let fixture: ComponentFixture<AnalyticalModelsComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AnalyticalModelsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ PipelineService ]
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AnalyticalModelsComponent);
    component = fixture.componentInstance;
    httpTestingController = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
