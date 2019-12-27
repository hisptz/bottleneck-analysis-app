import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilterGroupMemberComponent } from './data-filter-group-member.component';
import { FormsModule } from '@angular/forms';

describe('DataFilterGroupMemberComponent', () => {
  let component: DataFilterGroupMemberComponent;
  let fixture: ComponentFixture<DataFilterGroupMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DataFilterGroupMemberComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFilterGroupMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
