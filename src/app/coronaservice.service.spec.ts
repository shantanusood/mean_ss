import { TestBed } from '@angular/core/testing';

import { CoronaserviceService } from './coronaservice.service';

describe('CoronaserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoronaserviceService = TestBed.get(CoronaserviceService);
    expect(service).toBeTruthy();
  });
});
