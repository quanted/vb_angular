import { TestBed } from '@angular/core/testing';

import { AnalyticalModelService } from './analyticalmodel.service';

describe('AnalyticalmodelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyticalModelService = TestBed.get(AnalyticalModelService);
    expect(service).toBeTruthy();
  });
});
