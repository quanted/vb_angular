import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEsriLoaderComponent } from './map-esri-loader.component';

describe('MapEsriLoaderComponent', () => {
  let component: MapEsriLoaderComponent;
  let fixture: ComponentFixture<MapEsriLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapEsriLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEsriLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
