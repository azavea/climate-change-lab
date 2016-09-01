import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable, Observer} from "rxjs";
import 'rxjs/Rx';

import { Indicator } from '../models/indicator.models';
import { apiHost, apiToken } from "../constants";

/*
 * Indicators Service
 * Returns climate indicators. Used by the sidebar.
 */

@Injectable()
export class IndicatorsService {
    private indicators: Observable<Indicator[]>;
    private indicatorObserver: Observer<Indicator[]>;

    constructor(private http: Http) {
        this.indicators = new Observable<Indicator[]>(observer => this.indicatorObserver = observer);
    }

    get() {
        return this.indicators;
    }

    public loadIndicators() {
        let url = apiHost + 'indicator/';

        // append authorization header to request
        let headers = new Headers({
            'Authorization': 'Token ' + apiToken
        });
        let requestOptions = new RequestOptions({headers: headers});
        this.http.get(url, requestOptions)
            .map( resp => resp.json())
            .subscribe(resp => this.indicatorObserver.next(resp.results || {} as Indicator[]));

    }
}
