import { Component, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'ccl-app',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {

    // necessary to catch application root view container ref. see:
    // https://valor-software.com/ngx-bootstrap/#/modals
    constructor(public viewContainerRef: ViewContainerRef) {}

}
