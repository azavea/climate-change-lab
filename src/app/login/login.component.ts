import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { apiHost } from '../constants';
import { LoginForm } from './login-form';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ccl-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

    createAccountUrl = `${apiHost}/accounts/register/`;
    resetPasswordUrl = `${apiHost}/accounts/password/change/`;

    model = new LoginForm('', '');

    constructor(private router: Router, private authService: AuthService) {}

    onSubmit() {
        this.authService.login(this.model.email, this.model.password)
            .subscribe(() => this.onLoginSuccess(), error => this.onLoginError(error));
    }

    onLoginSuccess() {
        this.router.navigate(['/']);
    }

    onLoginError(error: any) {
        if (console && console.error) {
            console.error(error);
        }
        this.model.email = '';
        this.model.password = '';
    }
}
