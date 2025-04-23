import { TestBed } from '@angular/core/testing';

import { CartviewService } from './cartview.service';

describe('CartviewService', () => {
  let service: CartviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
