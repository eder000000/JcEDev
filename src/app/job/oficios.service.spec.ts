import { TestBed } from '@angular/core/testing';

import { OficiosService } from './oficios.service';

describe('OficiosService', () => {
  let service: OficiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OficiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
