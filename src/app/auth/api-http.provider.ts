import { XHRBackend, RequestOptions } from '@angular/http';

import { ApiHttp } from './api-http.service';
import { AuthService } from './auth.service';

export function apiHttpLoader(xhrBackend: XHRBackend,
                              requestOptions: RequestOptions,
                              authService: AuthService) {
                                  return new ApiHttp(xhrBackend, requestOptions, authService);
                              }

export let apiHttpProvider = {
    provide: ApiHttp,
    useFactory: apiHttpLoader,
    deps: [XHRBackend, RequestOptions, AuthService]
};
