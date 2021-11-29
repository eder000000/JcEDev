import { TestBed } from '@angular/core/testing';

import { HerokuAddressService } from './heroku-address.service';

describe('HerokuAddressService', () => {
  let service: HerokuAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HerokuAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
