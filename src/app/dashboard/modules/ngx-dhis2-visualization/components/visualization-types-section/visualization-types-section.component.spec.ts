import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationTypesSectionComponent } from './visualization-types-section.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('VisualizationTypesSectionComponent', () => {
  let component: VisualizationTypesSectionComponent;
  let fixture: ComponentFixture<VisualizationTypesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientModule
      ],
      declarations: [VisualizationTypesSectionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationTypesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
