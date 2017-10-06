import { TestBed, inject } from '@angular/core/testing';

import { OrgunitService } from './orgunit.service';

describe('OrgunitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgunitService]
    });
  });

  it('should be created', inject([OrgunitService], (service: OrgunitService) => {
    expect(service).toBeTruthy();
  }));
});
