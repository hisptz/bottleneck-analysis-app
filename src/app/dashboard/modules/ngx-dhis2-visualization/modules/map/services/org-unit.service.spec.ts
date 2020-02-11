import { TestBed, inject } from '@angular/core/testing';

import { OrgUnitService } from './org-unit.service';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';

describe('OrgUnitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDhis2HttpClientModule.forRoot({
          version: 1,
          namespace: 'bottleneck',
          models: {},
        }),
      ],
      providers: [OrgUnitService],
    });
  });

  it('should be created', inject(
    [OrgUnitService],
    (service: OrgUnitService) => {
      expect(service).toBeTruthy();
    }
  ));
});
