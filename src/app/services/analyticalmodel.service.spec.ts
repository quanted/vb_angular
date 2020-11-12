import { TestBed } from '@angular/core/testing';
import { AnalyticalModelService } from './analyticalmodel.service';
import { AnalyticalModelResponse, mockModel } from '../models/analytical-model-response';
import { HttpClientTestingModule, HttpTestingController } 
    from '@angular/common/http/testing';

describe('AnalyticalModelService', () => {
  let httpTestingController: HttpTestingController;
  let service : AnalyticalModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticalModelService],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AnalyticalModelService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: AnalyticalModelService = TestBed.inject(AnalyticalModelService);
    expect(service).toBeTruthy();
  });

  it('getModels() should provide models', () => {
    service.getModels("1").subscribe(model => {
      expect(model).not.toBe(null);
      expect(JSON.stringify(model)).toEqual(JSON.stringify(mockModel));
    });

    const req = httpTestingController
      .expectOne(`http://127.0.0.1:8080/api/analyticalmodel/1/`);
    req.flush(mockModel);
  });
});
