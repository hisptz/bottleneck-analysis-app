import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionFormComponent } from './intervention-form.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InterventionFormComponent', () => {
  let component: InterventionFormComponent;
  let fixture: ComponentFixture<InterventionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, SharedModule, BrowserAnimationsModule],
      declarations: [InterventionFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
