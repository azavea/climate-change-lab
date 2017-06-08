import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
// import 'rxjs/Rx';

import { City } from '../models/city.model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

/*
 * Scenario Service
 * Returns scenarios from API
 */
@Injectable()
export class CityService {

    constructor(private apiHttp: ApiHttp) {}

    public list(page?: Number, pageSize?: Number): Observable<City[]> {
        let url = apiHost + '/api/city/';

        let searchParams: URLSearchParams = new URLSearchParams();
        if (page) {
            searchParams.append('page', page.toString());
        }
        if (pageSize) {
            searchParams.append('pageSize', pageSize.toString());
        }

        let requestOptions = new RequestOptions({ search: searchParams });
        return this.apiHttp.get(url, requestOptions)
            .map(resp => resp.json().features || [] as City[]);
    }

    public search(text: string): Observable<City[]> {
        let url = apiHost + '/api/city/';
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.append('search', text);
        let requestOptions = new RequestOptions({ search: searchParams });
        return this.apiHttp.get(url, requestOptions)
            .map(response => response.json().features || [] as City[]);
    }

}
