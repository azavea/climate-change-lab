import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import 'rxjs/Rx';

import { Indicator } from '../models/indicator.model';
import { IndicatorQueryOpts } from '../models/indicator-query-opts.model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

/*
 * Indicator Service
 * Returns climate indicators. Used by the sidebar.
 */
@Injectable()
export class IndicatorService {
    constructor(private apiHttp: ApiHttp) {}

    public getData(options: IndicatorQueryOpts) {
        let url = `${apiHost}/api/climate-data/${options.city.id}/${options.scenario.name}` +
                  `/indicator/${options.indicator.name}/`;

        // Generate query params
        let searchParams: URLSearchParams = new URLSearchParams();
        if (options.years) {
            searchParams.append('years', options.years.join(','));
        }
        if (options.climateModels) {
            searchParams.append('models', options.climateModels.map(m => m.name).join(','));
        }
        if (options.time_aggregation) {
            searchParams.append('time_aggregation', options.time_aggregation);
        }

        let requestOptions = new RequestOptions({ search: searchParams });
        return this.apiHttp.get(url, requestOptions).map(resp => resp.json());
    }

    public list(): Observable<Indicator[]> {
        let url = apiHost + '/api/indicator/';
        return this.apiHttp.get(url)
            .map(resp => resp.json() || []);
    }
}
