import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticalComponent } from './analytical.component';
import { HttpClientTestingModule }
       from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { HttpRequestInterceptor } 
       from '../../services/testing/HttpRequestInterceptor';

describe('AnalyticalComponent', () => {
  let component: AnalyticalComponent;
  let fixture: ComponentFixture<AnalyticalComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AnalyticalComponent],
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
    fixture = TestBed.createComponent(AnalyticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
