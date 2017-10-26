import { Http, XHRBackend, RequestOptions } from '@angular/http';

import { LabApiHttp } from './api-http.service';
import { AuthService } from './auth.service';

export function apiHttpLoader(xhrBackend: XHRBackend,
                              requestOptions: RequestOptions,
                              authService: AuthService) {
                                  return new LabApiHttp(xhrBackend, requestOptions, authService);
                              }

export let apiHttpProvider = {
    provide: LabApiHttp,
    useFactory: apiHttpLoader,
    deps: [XHRBackend, RequestOptions, AuthService]
};
