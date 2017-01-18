/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DhisVisualizerService } from './dhis-visualizer.service';

describe('Service: DhisVisualizer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DhisVisualizerService]
    });
  });

  it('should ...', inject([DhisVisualizerService], (service: DhisVisualizerService) => {
    expect(service).toBeTruthy();
  }));
});
