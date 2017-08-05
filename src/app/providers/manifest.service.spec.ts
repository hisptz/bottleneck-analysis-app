import { TestBed, inject } from '@angular/core/testing';

import { ManifestService } from './manifest.service';

describe('ManifestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManifestService]
    });
  });

  it('should be created', inject([ManifestService], (service: ManifestService) => {
    expect(service).toBeTruthy();
  }));
});
