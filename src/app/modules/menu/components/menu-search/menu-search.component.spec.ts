import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSearchComponent } from './menu-search.component';

describe('MenuSearchComponent', () => {
  let component: MenuSearchComponent;
  let fixture: ComponentFixture<MenuSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
