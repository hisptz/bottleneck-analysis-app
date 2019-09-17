import { TestBed } from '@angular/core/testing';

import { RootCauseDataService } from './root-cause-data.service';

describe('RootCauseDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RootCauseDataService = TestBed.get(RootCauseDataService);
    expect(service).toBeTruthy();
  });
});
