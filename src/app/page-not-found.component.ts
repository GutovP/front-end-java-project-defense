import { Component } from '@angular/core';

@Component({
  selector: 'app-404',
  template: ` <h1 class="text-center pt-5">This page does not exist!</h1>
    <h3 class="text-center pt-5"><a href="/">Go Home</a></h3>`,
})
export class PageNotFoundComponent {}
