import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import {Observable, Observer} from "rxjs";
import 'rxjs/Rx';

import { Chart, ChartData } from '../models/chart';
import { Indicator } from '../models/indicator.models';
import { ClimateModel } from '../models/climate-model';
import { Scenario } from '../models/scenario';
import { apiHost, defaultCity, defaultScenario, defaultYears } from "../constants";
import { ApiHttp } from "../auth/api-http.service";
import { ProjectService } from "../services/project.service";

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
      indicator: null,
      years: defaultYears
    };

    chartList: Chart[] = [];

    private chartData: Observable<ChartData[]>;
    private chartDataObserver: Observer<ChartData[]>;

    constructor(private apiHttp: ApiHttp, private projectService: ProjectService) {
        this.chartData = new Observable<ChartData[]>(observer => this.chartDataObserver = observer);
    }

    get() {
        return this.chartList;
    }

    set(charts: Chart[]) {
        this.chartList = charts;
    }

    removeChart(chart) {
        this.chartList = this.chartList.filter(function(c) {
            return c !== chart;
        });
    }

    addChart(chart: Chart) {
        // Only update chartList upon new indicator; query for data
        if (!this.chartList.includes(chart)) {
            this.chartList.push(chart);
            this.loadChartData();
        }
    }

    getChartData(): Observable<ChartData[]> {
        return this.chartData;
    }

    loadChartData(): void {
        let queries = [];
        let options = this.dataQueryOptions;

        // send an empty notification to indicate that data is currently loading
        if (this.chartDataObserver) {
            this.chartDataObserver.next([]);
        }

        // query like:
        // https://staging.api.futurefeelslike.com/api/climate-data/1/RCP85/?variables=pr&years=2050:2051
        let url = apiHost + '/api/climate-data/' + options.cityId + '/' + options.scenario + '/';

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.append('years', options.years.join(','));
        searchParams.append('format', 'json');
        if (options.models) {
            searchParams.append('models', options.models);
        }

	    let requestOptions = new RequestOptions({search: searchParams});
        // Collect a query for each indicator
        _.each(this.chartList, chart => {
            options.indicator = chart.indicator.name;
            // query like:
            // https://staging.api.futurefeelslike.com/api/climate-data/1/RCP85/indicator/yearly_average_max_temperature/?years=2050:2051
            let url = apiHost + '/api/climate-data/' + options.cityId + '/' + options.scenario + '/indicator/' + options.indicator + '/';
            queries.push(this.apiHttp.get(url, requestOptions).map( resp => resp.json()));
        });

        // Multi-observable that updates subscribers only after all queries return
        Observable.forkJoin(queries).subscribe(resp => {
            this.chartDataObserver.next(this.convertChartData(resp || {}));
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

         // make array of [date, value] pairs with zip, then convert to keyed object
        _.each(data, obj => {
            let indicatorData = [];
            let indicator = obj.indicator;
            _.each(obj.data, (values, key) => {
                indicatorData.push({
                    'date': key,
                    'value': values.avg
                });
            });

            if (!_.includes(indicators, indicator)) {
                indicators.push(indicator);
                chartData.push({
                    'indicator': indicator,
                    'data': indicatorData,
                    'time_agg': indicator.label.match(/Daily/) || indicator.label.match(/Yearly/)
                } as ChartData);
            }
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
