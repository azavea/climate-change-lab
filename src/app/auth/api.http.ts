import { Injectable } from '@angular/core';
import { ConnectionBackend, Http, Headers, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from "rxjs";

import { apiToken } from "../constants";

import * as _ from 'lodash';

/**
 * Wrapper for Http that appends authorization headers for requests to the API backend,
 * and redirects unauthorized responses to login page.
 */
@Injectable()
export class ApiHttp extends Http {

    constructor(protected _backend: ConnectionBackend, protected _defaultOptions: RequestOptions) {
        super(_backend, _defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, this.appendAuthHeader(options)));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, this.appendAuthHeader(options)));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, this.appendAuthHeader(options)));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.appendAuthHeader(options)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    appendAuthHeader(options?: RequestOptionsArgs) : RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Authorization', 'Token ' + apiToken);
        return options;
    }

    /**
     * Check if request forbidden, and if so, redirect to login page.
     */
    intercept(observable: Observable<Response>): Observable<Response> {
        return observable.catch((err, source) => {

            // TODO: replace with acutal login URL when created
            if (err.status  == 401 && !_.endsWith(err.url, 'login')) {

                // TODO: set up to redirect to login
                console.error('need to log in');
                ///////////////////////////////

                return Observable.empty();
            } else {
                return Observable.throw(err);
            }
        });
    }
}
