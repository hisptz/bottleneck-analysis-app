import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingCardComponent } from './sharing-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

describe('SharingCardComponent', () => {
  let component: SharingCardComponent;
  let fixture: ComponentFixture<SharingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharingCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
