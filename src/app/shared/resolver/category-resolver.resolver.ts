import { ResolveFn } from '@angular/router';

export const categoryResolver: ResolveFn<string> = (route, state) => {

  return route.params['category'] || '';
};
