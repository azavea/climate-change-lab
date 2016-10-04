import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs";

import { apiHost } from '../constants';

@Injectable()
export class AuthService {

    private LOCALSTORAGE_TOKEN_KEY: string = 'auth.api.token';
    private LOCALSTORAGE_EMAIL_KEY: string = 'auth.api.email';

    // TODO: Inject a window or localStorage service here to abstract implicit
    //       dependency on window
    constructor(protected http: Http, protected router: Router) {}

    getToken(): string {
        return window.localStorage.getItem(this.LOCALSTORAGE_TOKEN_KEY) || null;
    }

    getEmail(): string {
        let defaultEmail = this.isAuthenticated() ? 'User' : 'Anonymous';
        return window.localStorage.getItem(this.LOCALSTORAGE_EMAIL_KEY) || defaultEmail;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    login(email: string, password: string): Observable<any> {
        let body = JSON.stringify({
            'email': email,
            'password': password
        });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let url = `${apiHost}/api-token-auth/`;
        return this.http.post(url, body, options).map(response => {
            let token = response.json().token;
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
