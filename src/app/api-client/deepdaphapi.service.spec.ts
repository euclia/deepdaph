import { TestBed } from '@angular/core/testing';

import { DeepdaphapiService } from './deepdaphapi.service';

describe('DeepdaphapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeepdaphapiService = TestBed.get(DeepdaphapiService);
    expect(service).toBeTruthy();
  });
});
