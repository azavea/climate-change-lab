import { Component, Input } from '@angular/core';

import { AuthService } from '../auth/auth.service';

import { apiHost } from '../constants';


@Component({
  selector: 'ccl-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

    @Input() projectID: string;

    public isSettingsDropdownOpen = false;
    public apiHost = apiHost;

    constructor(public authService: AuthService) {}
}
