import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerFormComponent } from './layer-form.component';

describe('LayerFormComponent', () => {
  let component: LayerFormComponent;
  let fixture: ComponentFixture<LayerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
