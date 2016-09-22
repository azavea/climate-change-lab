import { Component } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    public isSettingsDropdownOpen: boolean = false;
    public logoUrl: string = require('./climate-lab.svg');

    constructor(private authService: AuthService) {}
}
