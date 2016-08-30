import { Component } from '@angular/core';

import { NavbarComponent } from '../../navbar/navbar.component';

/*
 * Show when 404
 * PageNotFoundComponent
 */
@Component({
  selector: 'page-not-found',
  directives: [NavbarComponent],
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {}
