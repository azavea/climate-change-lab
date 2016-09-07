import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs";

import { apiHost } from '../constants';

@Injectable()
export class AuthService {

    private token: string;

    constructor(protected http: Http, protected router: Router) {}

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
            this.token = token;
        });
    }

    logout(redirectTo: string = '/login') {
        this.token = null;
        if (redirectTo) {
            this.router.navigate([redirectTo]);
        }
    }

    getToken(): string {
        return this.token || '';
    }

    isAuthenticated() {
        return !!this.token;
    }
}