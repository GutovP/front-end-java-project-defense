import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { NoAdminGuard } from './no-admin.guard';

describe('noAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => NoAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
