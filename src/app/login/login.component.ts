import { Component } from '@angular/core';

import { LoginForm } from './login-form';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

    model = new LoginForm('', '');

    onSubmit() {
        console.log(this.model);
    }

    get diagnostic() { return JSON.stringify(this.model); }
}
