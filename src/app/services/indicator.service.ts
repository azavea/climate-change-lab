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

        const url = `${apiHost}/api/climate-data/${options.city.id}/${options.scenario.name}` +
                         `/indicator/${options.indicator.name}/`;

        // Generate query params
        const searchParams: URLSearchParams = new URLSearchParams();
        const optParams = options.params;

        console.log(options.params);
        console.log('IndicatorQueryOpts');
        ///////

        // append extra parameters for threshold indicators
        if (options.indicator.thresholdIndicator) {
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
        const thresholdIndicatorNames = [
            'max_temperature_threshold',
            'min_temperature_threshold',
            'precipitation_threshold'
        ];

        let response = this.apiHttp.get(url).map(resp => {
            let indicators: Indicator[] = resp.json() || [];

            // set property to note if indicator requires extra params to query
            for (let i of indicators) {
                i.thresholdIndicator = false;
                for (let thresholdName of thresholdIndicatorNames) {
                    if (i.name === thresholdName) {
                        i.thresholdIndicator = true;
                    }
                }
            }
            return indicators;
        });

        return response;
    }
}
