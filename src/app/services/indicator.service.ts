import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/Rx';

import { Indicator } from '../models/indicator.model';
import { IndicatorQueryOpts } from '../models/indicator-query-opts.model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

import { isThresholdIndicator } from '../charts/extra-params-components/extra-params.constants';

/*
 * Indicator Service
 * Returns climate indicators. Used by the sidebar and to retrieve detail data for charts.
 */
@Injectable()
export class IndicatorService {
    constructor(private apiHttp: ApiHttp) {}

    public getData(options: IndicatorQueryOpts) {

        const url = `${apiHost}/api/climate-data/${options.city.id}/${options.scenario.name}` +
                         `/indicator/${options.indicator.name}/`;

        // Generate query params
        const searchParams: URLSearchParams = new URLSearchParams();
        const optParams = options.params;

        // append extra parameters, if needed
        if (isThresholdIndicator(options.indicator.name)) {
            // abort request if chart is in flux (these parameters are required)
            if (!optParams.threshold) {
                return Observable.of({url: ''});
            }
            searchParams.append('threshold', optParams.threshold.toString());
            searchParams.append('threshold_units', optParams.threshold_units);
            searchParams.append('threshold_comparator', optParams.threshold_comparator);
        }

        if (optParams.years) {
            searchParams.append('years', optParams.years.join(','));
        }
        if (optParams.climateModels) {
            searchParams.append('models', optParams.climateModels.map(m => m.name).join(','));
        }
        if (optParams.time_aggregation) {
            searchParams.append('time_aggregation', optParams.time_aggregation);
        }
        if (optParams.unit) {
            searchParams.append('units', optParams.unit);
        }

        const requestOptions = new RequestOptions({ search: searchParams });
        return this.apiHttp.get(url, requestOptions).map(resp => {
            const result = resp.json();
            // Append the queried URL to the JSON representation of the response body.
            // Discusson of what undocumented `Response` method `json` does, exactly:
            // https://stackoverflow.com/a/41309889
            result.url = resp.url;
            return result;
        });
    }

    public list(): Observable<Indicator[]> {
        const url = apiHost + '/api/indicator/';

       return this.apiHttp.get(url).map(resp => {
            const indicators: Indicator[] = resp.json() || [];
            return indicators;
        });
    }
}
