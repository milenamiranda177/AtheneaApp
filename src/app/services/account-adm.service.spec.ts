import { TestBed, inject } from '@angular/core/testing';

import { AccountService } from './account-adm.service';

describe('CheckListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService]
    });
  });

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));
});
