import { TestBed, inject } from '@angular/core/testing';

import { OrgunitGroupSetService } from './orgunit-group-set.service';

describe('OrgunitGroupSetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgunitGroupSetService]
    });
  });

  it('should be created', inject([OrgunitGroupSetService], (service: OrgunitGroupSetService) => {
    expect(service).toBeTruthy();
  }));
});
