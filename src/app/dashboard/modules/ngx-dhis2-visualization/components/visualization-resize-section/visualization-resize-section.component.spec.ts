import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationResizeSectionComponent } from './visualization-resize-section.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('VisualizationResizeSectionComponent', () => {
  let component: VisualizationResizeSectionComponent;
  let fixture: ComponentFixture<VisualizationResizeSectionComponent>;

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
      declarations: [VisualizationResizeSectionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationResizeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
