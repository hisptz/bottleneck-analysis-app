import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteFilterComponent } from './favorite-filter.component';
import { StoreModule } from '@ngrx/store';
import { reducers, effects } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { KNumberPipe } from '../../pipes/k-number.pipe';

describe('FavoriteFilterComponent', () => {
  let component: FavoriteFilterComponent;
  let fixture: ComponentFixture<FavoriteFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [FavoriteFilterComponent, KNumberPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
