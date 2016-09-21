import { Component, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'cc-lab',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {

    // necessary to catch application root view container ref. see:
    // https://valor-software.com/ng2-bootstrap/#/modals
    constructor(public viewContainerRef: ViewContainerRef) {}

}
