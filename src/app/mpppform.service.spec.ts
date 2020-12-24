import { TestBed } from '@angular/core/testing';

import { MpppformService } from './mpppform.service';

describe('MpppformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MpppformService = TestBed.get(MpppformService);
    expect(service).toBeTruthy();
  });
});
