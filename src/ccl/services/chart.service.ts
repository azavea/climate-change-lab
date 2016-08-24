import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from "rxjs";
import 'rxjs/Rx';


import { ChartData } from '../models/chart.models';
import { apiHost, apiToken } from "../constants";

import * as moment from 'moment';
import * as _ from 'lodash';

/*
 * Chart Service
 * Data management and operations for charts
 */

@Injectable()
export class ChartService {
    constructor(private http: Http) {}

    // TODO: pretty label
    chartList = ["pr"];

    get() {
        return this.chartList;
    }

    removeChart(indicator) {
        // TODO: Hook up to chart delete button
        this.chartList.filter(function(i) {
            return i !== indicator;
        });
    }

    addChart(indicator) {
        // Only update chartList upon new indicator
        if (!this.chartList.includes(indicator)) {
            this.chartList.push(indicator);
        }
    }

    getChartData(options: any): Observable<ChartData[]> {

        // query like:
        // https://staging.api.futurefeelslike.com/api/climate-data/1/RCP85/?variables=pr&years=2050:2051
        let url = apiHost + 'climate-data/' + options.cityId + '/' + options.scenario + '/';
        url += '?variables=' + options.variables + '&years=' + options.years;

        // append authorization header to request
        let headers = new Headers({
            'Authorization': 'Token ' + apiToken
        });
        let requestOptions = new RequestOptions({headers: headers});

        let me = this;
        return this.http.get(url, requestOptions)
            .map( resp => resp.json())
            .map( resp => {
                //return this.convertChartData(resp.data || {});
                let chartData: ChartData[] = this.convertChartData(resp.data || {});
                return chartData;
            });

        /* FIXME: remove this test data fetch
        return this.http.get('/assets/mockdata/d3_precip_graph_data.json')
          .map(response => response.json() as ChartData);
        */
    }

    // return an array of date strings for each day in the given year
    getDaysInYear(year: number): string[] {
        var oneDate = moment.utc(+year + '-01-01', 'YYYY-MM-DD', true);
        let days: string[] = [];
        while (oneDate.get('year') == year) {
            days.push(oneDate.format('YYYY-MM-DD'));
            oneDate.add(1, 'day');
        }
        return days;
    }

    // map array of daily readings to date for each reading and drop top-level year key
    convertChartData(data: any): ChartData[] {
        let me = this;
        let indicators = [];
        let chartData: ChartData[] = [];
        _.each(_.keys(data), function(key) {
            let days: string[] = me.getDaysInYear(key);
            _.each(_.keys(data[key]), function(indicator) {
                // make array of [date, value] pairs with zip, then convert to keyed object
                var indicatorData = _.map(_.zip(days, data[key][indicator]), function(arr) {
                    return {
                        'date': arr[0],
                        'value': arr[1]
                    };
                });

                if (!_.includes(indicators, indicator)) {
                    indicators.push(indicator);
                    chartData.push({
                        'indicator': indicator,
                        'data': indicatorData
                    } as ChartData);
                } else {
                    // have multiple years; append to existing indicator data
                    chartData[indicator]['data'].push(indicatorData);
                }
            });
        });

        return chartData;
    }
}
