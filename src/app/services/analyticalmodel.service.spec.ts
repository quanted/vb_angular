import { TestBed } from '@angular/core/testing';

import { AnalyticalmodelService } from './analyticalmodel.service';

describe('AnalyticalmodelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyticalmodelService = TestBed.get(AnalyticalmodelService);
    expect(service).toBeTruthy();
  });
});
