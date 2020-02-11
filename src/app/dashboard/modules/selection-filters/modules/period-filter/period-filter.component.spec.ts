import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodFilterComponent } from './period-filter.component';
import { FormsModule } from '@angular/forms';

describe('PeriodFilterComponent', () => {
  let component: PeriodFilterComponent;
  let fixture: ComponentFixture<PeriodFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PeriodFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  // });
});
