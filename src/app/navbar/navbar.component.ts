import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

import { apiHost } from '../constants';


@Component({
  selector: 'ccl-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

    @Input() projectID: string;

    public isSettingsDropdownOpen = false;
    public apiHost = '';

    constructor(public authService: AuthService) {}

    ngOnInit() {
      const lowercaseApiHost = apiHost.toLowerCase();
      if (lowercaseApiHost.indexOf('localhost') !== -1) {
        this.apiHost = 'localhost:8080';
      } else if (lowercaseApiHost.indexOf('staging') !== -1) {
        this.apiHost = 'app.staging.climate.azavea.com';
      } else {
        this.apiHost = 'app.climate.azavea.com';
      }
    }
}
