import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { apiHost } from '../constants';
import { LoginForm } from './login-form';
import { AuthService } from '../auth/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

    constructor(private router: Router, private authService: AuthService) {}

    createAccountUrl: string = `${apiHost}/accounts/register/`;
    resetPasswordUrl: string = `${apiHost}/accounts/password/change/`;

    model = new LoginForm('', '');

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
