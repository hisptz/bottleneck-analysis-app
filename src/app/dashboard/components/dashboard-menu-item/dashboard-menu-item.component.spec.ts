import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuItemComponent } from './dashboard-menu-item.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

describe('DashboardMenuItemComponent', () => {
  let component: DashboardMenuItemComponent;
  let fixture: ComponentFixture<DashboardMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [DashboardMenuItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
