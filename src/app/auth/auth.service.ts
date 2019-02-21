import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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

    isAuthenticated(): Observable<boolean> {
        return this.acquireTokenFromApi().map(response => {
            return !!this.getToken();
        });
    }

    acquireTokenFromApi(): Observable<any> {
        // Attempts to request a token from the API, relying on the user having
        // already logged in and able to use cookie based authentication
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers, withCredentials: true });
        const url = `${apiHost}/api-token/`;
        return this.http.get(url, options).map(response => {
            const token = response.json().token;
            const email = response.json().email;
            this.setToken(token);
            this.setEmail(email);
        }).catch((error: Response) => {
            if (error.status === 401 || error.status === 403) {
                this.setToken(null);
                this.setEmail(null);
            }
            return Observable.of(null);
        });
    }

    logout() {
        this.setToken(null);
        this.setEmail(null);
        window.location.assign(`${apiHost}/accounts/logout/`);
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
