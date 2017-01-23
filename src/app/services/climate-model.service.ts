import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

import { ClimateModel } from '../models/climate-model.model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

/*
 * Climate Model Service
 * Returns climate models from API
 */
@Injectable()
export class ClimateModelService {

    constructor(private apiHttp: ApiHttp) {}

    public list(): Observable<ClimateModel[]> {
        let url = apiHost + '/api/climate-model/';
        return this.apiHttp.get(url).map(resp => resp.json() || [] as ClimateModel[]);
    }
}

