import { Component, Input } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Project } from '../models/project';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

    @Input() projectID: string;

    public isSettingsDropdownOpen: boolean = false;
    public logoUrl: string = require('./climate-logo-white.svg');

    constructor(private authService: AuthService) {}
}
