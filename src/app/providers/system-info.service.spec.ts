import { TestBed, inject } from '@angular/core/testing';

import { SystemInfoService } from './system-info.service';

describe('SystemInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemInfoService]
    });
  });

  it('should be created', inject([SystemInfoService], (service: SystemInfoService) => {
    expect(service).toBeTruthy();
  }));
});
