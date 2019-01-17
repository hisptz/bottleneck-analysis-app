import { TestBed, inject } from '@angular/core/testing';

import { AppDatabaseService } from './app-database.service';

describe('AppDatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppDatabaseService]
    });
  });

  it('should be created', inject([AppDatabaseService], (service: AppDatabaseService) => {
    expect(service).toBeTruthy();
  }));
});
