import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  directives: [ NavbarComponent ]
})
export class DashboardComponent {}
