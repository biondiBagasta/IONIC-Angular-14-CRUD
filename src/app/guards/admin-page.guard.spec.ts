import { TestBed } from '@angular/core/testing';

import { AdminPageGuard } from './admin-page.guard';

describe('AdminPageGuard', () => {
  let guard: AdminPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
