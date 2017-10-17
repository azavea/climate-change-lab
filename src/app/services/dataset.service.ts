import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Dataset } from '../models/dataset.model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

/*
 * Dataset Service
 * Returns datasets from API
 */
@Injectable()
export class DatasetService {

    constructor(private apiHttp: ApiHttp) {}

    public list(): Observable<Dataset[]> {
        const url = apiHost + '/api/dataset/';
        return this.apiHttp.get(url).map(resp => resp.json() || [] as Dataset[]);
    }
}
