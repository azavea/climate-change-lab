import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { apiHost } from '../constants';
import { LoginForm } from './login-form';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

    constructor(private router: Router, private authService: AuthService) {}

    createAccountUrl: string = `${apiHost}/accounts/register/`
    resetPasswordUrl: string = `${apiHost}/accounts/password/change/`

    model = new LoginForm('', '');

    onSubmit() {
        this.authService.login(this.model.username, this.model.password)
            .subscribe(() => this.router.navigate(['/']), error => console.error(error));
    }

    get diagnostic() { return JSON.stringify(this.model); }
}
