import { TestBed, inject } from '@angular/core/testing';

import { CodeProductService } from './code-product.service';

describe('CodeProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeProductService]
    });
  });

  it('should be created', inject([CodeProductService], (service: CodeProductService) => {
    expect(service).toBeTruthy();
  }));
});
