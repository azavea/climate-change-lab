import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable, Observer} from "rxjs";
import 'rxjs/Rx';

import { ChartData, ClimateModel } from '../models/chart.models';
import { apiHost, apiToken, defaultCity } from "../constants";

import * as moment from 'moment';
import * as _ from 'lodash';

/*
 * Chart Service
 * Data management and operations for charts
 */

@Injectable()
export class ChartService {

    // FIXME: using dummy options for API query
    dataQueryOptions: any = {
      cityId: defaultCity.id,
      scenario: 'RCP85',
      variables: 'pr',
      years: '2070'
    };

    // TODO: pretty label
    chartList = ["pr"];

    private chartData: Observable<ChartData[]>;
    private chartDataObserver: Observer<ChartData[]>;

    private climateModels: Observable<ClimateModel[]>;
    private climateModelObserver: Observer<ClimateModel[]>;

    constructor(private http: Http) {
        this.chartData = new Observable<ChartData[]>(observer => this.chartDataObserver = observer);
        this.climateModels = new Observable<ClimateModel[]>(observer =>
                                                            this.climateModelObserver = observer);
    }

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

    getChartData(): Observable<ChartData[]> {
        return this.chartData;
    }

    getClimateModels(): Observable<ClimateModel[]> {
        return this.climateModels;
    }

    loadChartData(): void {

        let options = this.dataQueryOptions;

        // query like:
        // https://staging.api.futurefeelslike.com/api/climate-data/1/RCP85/?variables=pr&years=2050:2051
        let url = apiHost + 'climate-data/' + options.cityId + '/' + options.scenario + '/';

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.append('variables', options.variables);
        searchParams.append('years', options.years);
        searchParams.append('format', 'json');

        // append authorization header to request
        let headers = new Headers({
            'Authorization': 'Token ' + apiToken
        });
        let requestOptions = new RequestOptions({headers: headers, search: searchParams});
        this.http.get(url, requestOptions)
            .map( resp => resp.json())
            .subscribe(resp => {
                this.chartDataObserver.next(this.convertChartData(resp.data || {}));
            });
    }

    loadClimateModels(): void {
        let url = apiHost + 'climate-model/';

        // append authorization header to request
        let headers = new Headers({
            'Authorization': 'Token ' + apiToken
        });
        let requestOptions = new RequestOptions({headers: headers});
        this.http.get(url, requestOptions)
            .map( resp => resp.json())
            .subscribe(resp => {
                this.climateModelObserver.next(resp || {} as ClimateModel[]);
            });
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
        let self = this;
        let indicators = [];
        let chartData: ChartData[] = [];
        _.each(_.keys(data), function(key) {
            let days: string[] = self.getDaysInYear(key);
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

    public updateCity(city: any): void {
        this.dataQueryOptions.cityId = city.id;
        this.loadChartData();
    }
}
