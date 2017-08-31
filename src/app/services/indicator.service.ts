import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/Rx';

import { Indicator } from '../models/indicator.model';
import { IndicatorRequestOpts } from '../models/indicator-request-opts.model';
import { ThresholdIndicatorQueryParams } from '../models/threshold-indicator-query-params.model';
import { BasetempIndicatorQueryParams } from '../models/basetemp-indicator-query-params.model';
import { IndicatorQueryParams } from '../models/indicator-query-params.model';\

import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from '../constants';

import { isBasetempIndicator,
         isThresholdIndicator } from '../charts/extra-params-components/extra-params.constants';

/*
 * Indicator Service
 * Returns climate indicators. Used by the sidebar and to retrieve detail data for charts.
 */
@Injectable()
export class IndicatorService {
    constructor(private apiHttp: ApiHttp) {}

    public getData(options: IndicatorRequestOpts) {

        const url = `${apiHost}/api/climate-data/${options.city.id}/${options.scenario.name}` +
                         `/indicator/${options.indicator.name}/`;

        // Generate query params
        const searchParams: URLSearchParams = new URLSearchParams();

        // append extra parameters, if needed
        if (isThresholdIndicator(options.indicator.name)) {
            const thresholdParams = options.params as ThresholdIndicatorQueryParams;
            // abort request if chart is in flux (these parameters are required)
            if (!thresholdParams.threshold) {
                return Observable.of({url: ''});
            }
            searchParams.append('threshold', thresholdParams.threshold.toString());
            searchParams.append('threshold_units', thresholdParams.threshold_units);
            searchParams.append('threshold_comparator', thresholdParams.threshold_comparator);
        }

        // append extra parameters, if needed
        if (isBasetempIndicator(options.indicator.name)) {
            const basetempOpts: BasetempIndicatorQueryOpts = <BasetempIndicatorQueryOpts> options;
            // abort request if chart is in flux (these parameters are required)
            if (!basetempOpts.params.basetemp) {
                return Observable.of({url: ''});
            }
            searchParams.append('basetemp', basetempOpts.params.basetemp.toString());
            searchParams.append('basetemp_units', basetempOpts.params.basetemp_units);
        }

        if (options.params.years) {
            searchParams.append('years', options.params.years.join(','));
        }
        if (options.params.climateModels) {
            searchParams.append('models', options.params.climateModels.map(m => m.name).join(','));
        }
        if (options.params.time_aggregation) {
            searchParams.append('time_aggregation', options.params.time_aggregation);
        }
        if (options.params.unit) {
            searchParams.append('units', options.params.unit);
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
