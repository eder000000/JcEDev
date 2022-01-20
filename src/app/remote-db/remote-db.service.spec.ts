import { TestBed } from '@angular/core/testing';

import { RemoteDbService } from './remote-db.service';

describe('RemoteDbService', () => {
  let service: RemoteDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
