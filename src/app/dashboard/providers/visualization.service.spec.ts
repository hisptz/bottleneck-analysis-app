import { TestBed, inject } from '@angular/core/testing';

import { VisualizationService } from './visualization.service';

describe('VisualizationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisualizationService]
    });
  });

  it('should be created', inject([VisualizationService], (service: VisualizationService) => {
    expect(service).toBeTruthy();
  }));
});
