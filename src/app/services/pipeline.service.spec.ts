import { TestBed } from '@angular/core/testing';
import { PipelineService } from './pipeline.service';
import { AnalyticalModelResponse, mockModel } from '../models/analytical-model-response';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AnalyticalModelService', () => {
  let httpTestingController: HttpTestingController;
  let service: PipelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PipelineService],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PipelineService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: PipelineService = TestBed.inject(PipelineService);
    expect(service).toBeTruthy();
  });

  it('getModels() should provide models', () => {
    service.getModels("1").subscribe(model => {
      expect(model).not.toBe(null);
      expect(JSON.stringify(model)).toEqual(JSON.stringify(mockModel));
    });

    const req = httpTestingController
      .expectOne(`http://127.0.0.1:8080/api/analyticalmodel/project_id=1`);
    req.flush(mockModel);
  });
});
