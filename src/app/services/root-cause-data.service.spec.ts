import { TestBed } from '@angular/core/testing';

import { RootCauseDataService } from './root-cause-data.service';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';

describe('RootCauseDataService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        NgxDhis2HttpClientModule.forRoot({
          version: 1,
          namespace: 'bottleneck',
          models: {},
        }),
      ],
    })
  );

  it('should be created', () => {
    const service: RootCauseDataService = TestBed.get(RootCauseDataService);
    expect(service).toBeTruthy();
  });
});
