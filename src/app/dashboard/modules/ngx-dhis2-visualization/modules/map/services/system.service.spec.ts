import { TestBed, inject } from '@angular/core/testing';

import { SystemService } from './system.service';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';

describe('SystemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDhis2HttpClientModule.forRoot({
          version: 1,
          namespace: 'bottleneck',
          models: {},
        }),
      ],
      providers: [SystemService],
    });
  });

  it('should be created', inject([SystemService], (service: SystemService) => {
    expect(service).toBeTruthy();
  }));
});
