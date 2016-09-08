import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs";

import { apiHost } from '../constants';

@Injectable()
export class AuthService {

    private LOCALSTORAGE_KEY: string = 'auth.api.token';

    // TODO: Inject a window or localStorage service here to abstract implicit
    //       dependency on window
    constructor(protected http: Http, protected router: Router) {}

    getToken(): string {
        return window.localStorage.getItem(this.LOCALSTORAGE_KEY) || null;
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    login(username: string, password: string): Observable<any> {
        let body = JSON.stringify({
            'username': username,
            'password': password
        });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let url = `${apiHost}/api-token-auth/`;
        return this.http.post(url, body, options).map(response => {
            let token = response.json().token;
            this.setToken(token);
        });
    }

    logout(redirectTo: string = '/login') {
        this.setToken(null);
        if (redirectTo) {
            this.router.navigate([redirectTo]);
        }
    }

    private setToken(token) {
        window.localStorage.setItem(this.LOCALSTORAGE_KEY, token);
    }
}