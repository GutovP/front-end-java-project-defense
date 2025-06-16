import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { categoryResolverResolver } from './category-resolver.resolver';

describe('categoryResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => categoryResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
