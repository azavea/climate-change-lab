import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable, Observer} from "rxjs";
import 'rxjs/Rx';

import { ChartData, ClimateModel, Scenario } from '../models/chart.models';
import { apiHost, apiToken, defaultCity, defaultScenario, defaultVariable, defaultIndicator, defaultYears } from "../constants";

import * as moment from 'moment';
import * as _ from 'lodash';

/*
 * Chart Service
 * Data management and operations for charts
 */

@Injectable()
export class ChartService {

    dataQueryOptions = {
      cityId: defaultCity.id,
      models: null, // default to all
      scenario: defaultScenario,
      indicator: defaultIndicator,
      variables: defaultVariable,
      years: defaultYears
    };

    // TODO: pretty label for variable name?
    chartList = [defaultVariable];

    private chartData: Observable<ChartData[]>;
    private chartDataObserver: Observer<ChartData[]>;

    private climateModels: Observable<ClimateModel[]>;
    private climateModelObserver: Observer<ClimateModel[]>;

    private scenarios: Observable<Scenario[]>;
    private scenarioObserver: Observer<Scenario[]>;

    constructor(private http: Http) {
        this.chartData = new Observable<ChartData[]>(observer => this.chartDataObserver = observer);
        this.climateModels = new Observable<ClimateModel[]>(observer =>
                                                            this.climateModelObserver = observer);
        this.scenarios = new Observable<Scenario[]>(observer => this.scenarioObserver = observer);
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

    getScenarios(): Observable<Scenario[]> {
        return this.scenarios;
    }

    loadChartData(): void {

        let options = this.dataQueryOptions;

        // query like:
        // https://staging.api.futurefeelslike.com/api/climate-data/1/RCP85/?variables=pr&years=2050:2051
        let url = apiHost + 'climate-data/' + options.cityId + '/' + options.scenario + '/';

        let searchParams: URLSearchParams = new URLSearchParams();
        if (options.indicator) {
            url += 'indicator/' + options.indicator + '/';
        } else if (options.variables) {
            searchParams.append('variables', options.variables);
        }
        searchParams.append('years', options.years);
        searchParams.append('format', 'json');
        if (options.models) {
            searchParams.append('models', options.models);
        }

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

    loadScenarios(): void {
        let url = apiHost + 'scenario/';

        // append authorization header to request
        let headers = new Headers({
            'Authorization': 'Token ' + apiToken
        });
        let requestOptions = new RequestOptions({headers: headers});
        this.http.get(url, requestOptions)
            .map( resp => resp.json())
            .subscribe(resp => {
                this.scenarioObserver.next(resp || {} as Scenario[]);
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
        let indicators = [];
        let chartData: ChartData[] = [];
        _.each(_.keys(data), (key) => {
            let days: string[] = this.getDaysInYear(key);
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

    public updateClimateModels(models: string[]): void {
        if (models.length) {
            this.dataQueryOptions.models = models.join(',');
        } else if (this.dataQueryOptions.models) {
            // default to all by specifying none
            this.dataQueryOptions.models = null;
        }
        this.loadChartData();
    }

    public updateScenario(scenario: string): void {
        this.dataQueryOptions.scenario = scenario;
        this.loadChartData();
    }
}
