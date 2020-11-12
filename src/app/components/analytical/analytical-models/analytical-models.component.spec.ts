import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticalModelsComponent } from './analytical-models.component';
import { AnalyticalModelService } from '../../../services/analyticalmodel.service';
import { HttpClientTestingModule, HttpTestingController }
       from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {AnalyticalModelResponse, mockModel} from '../../../models/analytical-model-response';

describe('AnalyticalModelsComponent', () => {
  let component: AnalyticalModelsComponent;
  let fixture: ComponentFixture<AnalyticalModelsComponent>;
  let httpTestingController: HttpTestingController;
  let mockModels: AnalyticalModelResponse[] = [mockModel]

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AnalyticalModelsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ AnalyticalModelService ]
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

  it('should return model', () => {
    component.getModels("1");
    const req = httpTestingController.expectOne(`http://127.0.0.1:8080/api/analyticalmodel/1/`);
    req.flush(mockModel);
    expect(JSON.stringify(component.models)).toEqual(JSON.stringify(mockModels[0]));
  });
});
