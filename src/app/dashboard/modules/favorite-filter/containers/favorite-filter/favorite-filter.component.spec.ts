import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteFilterComponent } from './favorite-filter.component';

describe('FavoriteFilterComponent', () => {
  let component: FavoriteFilterComponent;
  let fixture: ComponentFixture<FavoriteFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
