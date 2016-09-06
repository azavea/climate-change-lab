import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  directives: [ NavbarComponent ]
})
export class DashboardComponent {

    // TODO: replace any type with a project model
    private projects: any[];

    constructor() {
        // TODO: Eventually query for saved projects
        this.projects = [];
    }
}
