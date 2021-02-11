import { TestBed } from "@angular/core/testing";
import { DatasetService } from "./dataset.service";
import { HttpClientTestingModule, HttpTestingController } 
    from '@angular/common/http/testing';

describe("DatasetService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it("should be created", () => {
    const service: DatasetService = TestBed.get(DatasetService);
    expect(service).toBeTruthy();
  });
});
