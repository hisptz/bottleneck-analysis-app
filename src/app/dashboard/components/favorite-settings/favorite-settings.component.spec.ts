import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSettingsComponent } from './favorite-settings.component';

describe('FavoriteSettingsComponent', () => {
  let component: FavoriteSettingsComponent;
  let fixture: ComponentFixture<FavoriteSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
