import { TestBed, inject } from '@angular/core/testing';

import { LegendSetService } from './legend-set.service';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';

describe('LegendSetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDhis2HttpClientModule.forRoot({
          version: 1,
          namespace: 'bottleneck',
          models: {},
        }),
      ],
      providers: [LegendSetService],
    });
  });

  it('should be created', inject(
    [LegendSetService],
    (service: LegendSetService) => {
      expect(service).toBeTruthy();
    }
  ));
});
