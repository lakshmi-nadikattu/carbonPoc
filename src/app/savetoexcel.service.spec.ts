import { TestBed } from '@angular/core/testing';

import { SavetoexcelService } from './savetoexcel.service';

describe('SavetoexcelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SavetoexcelService = TestBed.get(SavetoexcelService);
    expect(service).toBeTruthy();
  });
});
