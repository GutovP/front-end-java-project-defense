import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { loadingInterceptor } from './shared/interceptors/loading.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes, 
      withInMemoryScrolling({scrollPositionRestoration: 'enabled'}),
      withComponentInputBinding()
  ),
    provideHttpClient(withInterceptors([jwtInterceptor, loadingInterceptor])),
    
  ],
};
