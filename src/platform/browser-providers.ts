/*
 * These are globally available services in any component or any other service
 */

// Angular 2
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {provide} from '@angular/core';
// Angular 2 Http
import { HTTP_PROVIDERS, Http, RequestOptions, XHRBackend } from '@angular/http';
// Custom Http wrapper for authentication
import { ApiHttp } from '../app/auth/api.http';
import { AuthService } from '../app/auth/auth.service';

/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS = [
    ...HTTP_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(ApiHttp, {
        useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, authService: AuthService) => new ApiHttp(xhrBackend, requestOptions, authService),
        deps: [XHRBackend, RequestOptions, AuthService]
    })
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
