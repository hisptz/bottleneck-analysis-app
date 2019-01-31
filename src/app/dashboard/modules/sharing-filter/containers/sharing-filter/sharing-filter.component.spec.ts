import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingFilterComponent } from './sharing-filter.component';
import { LimitPipe } from '../../pipes/limit.pipe';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FilterByNamePipe } from '../../pipes/filter-by-name.pipe';
import { StoreModule } from '@ngrx/store';
import { reducers, effects } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';

describe('SharingFilterComponent', () => {
  let component: SharingFilterComponent;
  let fixture: ComponentFixture<SharingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [SharingFilterComponent, LimitPipe, FilterByNamePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
