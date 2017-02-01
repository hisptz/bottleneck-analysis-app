/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InterpretationService } from './interpretation.service';

describe('InterpretationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterpretationService]
    });
  });

  it('should ...', inject([InterpretationService], (service: InterpretationService) => {
    expect(service).toBeTruthy();
  }));
});
