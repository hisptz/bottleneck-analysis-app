import { TestBed, inject } from '@angular/core/testing';

import { GeoFeatureService } from './geo-feature.service';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';

describe('GeoFeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDhis2HttpClientModule.forRoot({
          version: 1,
          namespace: 'bottleneck',
          models: {},
        }),
      ],
      providers: [GeoFeatureService],
    });
  });

  it('should be created', inject(
    [GeoFeatureService],
    (service: GeoFeatureService) => {
      expect(service).toBeTruthy();
    }
  ));
});
