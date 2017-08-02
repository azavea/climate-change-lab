import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/Rx';

import { Indicator } from '../models/indicator.model';
import { IndicatorQueryOpts } from '../models/indicator-query-opts.model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

/*
 * Indicator Service
 * Returns climate indicators. Used by the sidebar and to retrieve detail data for charts.
 */
@Injectable()
export class IndicatorService {
    constructor(private apiHttp: ApiHttp) {}

    public getData(options: IndicatorQueryOpts) {

        const getDetailUrl = `${apiHost}/api/climate-data/${options.city.id}/${options.scenario.name}` +
                         `/indicator/${options.indicator.name}/`;

        // Generate query params
        const searchParams: URLSearchParams = new URLSearchParams();
        if (options.years) {
            searchParams.append('years', options.years.join(','));
        }
        if (options.climateModels) {
            searchParams.append('models', options.climateModels.map(m => m.name).join(','));
        }
        if (options.time_aggregation) {
            searchParams.append('time_aggregation', options.time_aggregation);
        }

        const requestOptions = new RequestOptions({ search: searchParams });
        return this.apiHttp.get(getDetailUrl, requestOptions).map(resp => {
            let result = resp.json();
            // Append the queried URL to the JSON representation of the response body.
            // Discusson of what undocumented `Response` method `json` does, exactly:
            // https://stackoverflow.com/a/41309889
            result.url = resp.url;
            return result;
        });
    }

    public list(): Observable<Indicator[]> {
        const url = apiHost + '/api/indicator/';
        return this.apiHttp.get(url)
            .map(resp => resp.json() || []);
    }
}
