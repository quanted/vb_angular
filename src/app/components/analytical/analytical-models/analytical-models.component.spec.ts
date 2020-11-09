import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticalModelsComponent } from './analytical-models.component';
import { HttpClientTestingModule }
       from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { HttpRequestInterceptor } 
       from '../../../services/testing/HttpRequestInterceptor';
import {mockModel} from '../../../models/analytical-model-response';

describe('AnalyticalModelsComponent', () => {
  let component: AnalyticalModelsComponent;
  let fixture: ComponentFixture<AnalyticalModelsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AnalyticalModelsComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpRequestInterceptor,
          multi: true
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticalModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table of models', (done) => {
    expect(component.models).toEqual(mockModel);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
  
      let tableRows = fixture.nativeElement.querySelectorAll('tr');
      expect(tableRows.length).toBe(4);
  
      // Header row
      let headerRow = tableRows[0];
      expect(headerRow.cells[0].innerHTML).toBe('Email');
      expect(headerRow.cells[1].innerHTML).toBe('Created');
      expect(headerRow.cells[2].innerHTML).toBe('Roles');
  
      // Data rows
      let row1 = tableRows[1];
      expect(row1.cells[0].innerHTML).toBe('dummy@mail.com');
      expect(row1.cells[1].innerHTML).toBe('01-01-2020');
      expect(row1.cells[2].innerHTML).toBe('admin,standard');
  
      // Test more rows here..
  
      done();
    });
  });
});
