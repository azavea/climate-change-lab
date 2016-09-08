import { Injectable } from '@angular/core';
import { ConnectionBackend, Http, Headers, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

import * as _ from 'lodash';

/**
 * Wrapper for Http that appends authorization headers for requests to the API backend,
 * and redirects unauthorized responses to login page.
 */
@Injectable()
export class ApiHttp extends Http {

    constructor(protected _backend: ConnectionBackend,
                protected _defaultOptions: RequestOptions,
                protected authService: AuthService) {
        super(_backend, _defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, this.appendAuthHeader(options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(url, this.appendAuthHeader(options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.post(url, body, this.appendAuthHeader(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.put(url, body, this.appendAuthHeader(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.delete(url, this.appendAuthHeader(options));
    }

    appendAuthHeader(options?: RequestOptionsArgs) : RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.set('Authorization', 'Token ' + this.authService.getToken());
        return options;
    }
}
