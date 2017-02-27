import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuHolderComponent } from './context-menu-holder.component';

describe('ContextMenuHolderComponent', () => {
  let component: ContextMenuHolderComponent;
  let fixture: ComponentFixture<ContextMenuHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
