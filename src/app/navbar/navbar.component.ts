import { Component, Input } from '@angular/core';

import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

    @Input() projectID: string;

    public isSettingsDropdownOpen: boolean = false;

    constructor(public authService: AuthService) {}
}
