import { TestBed } from '@angular/core/testing';

import { Deezer } from './deezer';

describe('Deezer', () => {
  let service: Deezer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deezer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
