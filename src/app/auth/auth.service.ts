import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { apiHost } from '../constants';

@Injectable()
export class AuthService {

    private LOCALSTORAGE_TOKEN_KEY = 'auth.api.token';
    private LOCALSTORAGE_EMAIL_KEY = 'auth.api.email';

    // TODO: Inject a window or localStorage service here to abstract implicit
    //       dependency on window
    constructor(protected http: Http, protected router: Router) {}

    getToken(): string {
        return window.localStorage.getItem(this.LOCALSTORAGE_TOKEN_KEY) || null;
    }

    getEmail(): string {
        const defaultEmail = this.isAuthenticated() ? 'User' : 'Anonymous';
        return window.localStorage.getItem(this.LOCALSTORAGE_EMAIL_KEY) || defaultEmail;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    login(email: string, password: string): Observable<any> {
        const body = JSON.stringify({
            'email': email,
            'password': password
        });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const url = `${apiHost}/api-token-auth/`;
        return this.http.post(url, body, options).map(response => {
            const token = response.json().token;
            this.setEmail(email);
            this.setToken(token);
        });
    }

    logout(redirectTo: string = '/login') {
        this.setToken(null);
        this.setEmail(null);
        if (redirectTo) {
            this.router.navigate([redirectTo]);
        }
    }

    private setToken(token: string | null) {
        this.setLocalStorageValue(this.LOCALSTORAGE_TOKEN_KEY, token);
    }

    private setEmail(email: string | null) {
        this.setLocalStorageValue(this.LOCALSTORAGE_EMAIL_KEY, email);
    }

    private setLocalStorageValue(key: string, value: string | null) {
        if (value) {
            window.localStorage.setItem(key, value);
        } else {
            window.localStorage.removeItem(key);
        }
    }
}
