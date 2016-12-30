import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ChartData } from '../models/chart-data.model';
import { MultiDataPoint } from '../models/multi-data-point.model';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as D3 from 'd3';

/*
 * Chart Service
 * Data management and operations for charts
 */
@Injectable()
export class ChartService {

    private _multiChartScrubberInfo = new Subject();
    private _multiChartScrubberHover = new Subject<Boolean>();

    public multiChartScrubberInfoObservable = this._multiChartScrubberInfo.asObservable();
    public multiChartScrubberHoverObservable = this._multiChartScrubberHover.asObservable();


    private timeOptions = {
          'yearly': '%Y',
          'daily': '%Y-%m-%d',
          'monthly': '%Y-%m'
        };

    constructor() {}

    // receive and ship mousemove event
    updateMultiChartScrubberInfo(event) {
        this._multiChartScrubberInfo.next(event);
    }
    // receive and ship overlay mouseover status
    detectMultiChartHover(bool: Boolean) {
        this._multiChartScrubberHover.next(bool);
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

    // map array of IndicatorService.getData responses to date for each data point
    // and drop top-level year key
    convertChartData(data: any): ChartData[] {
        let indicators = [];
        let chartData: ChartData[] = [];

         // make array of [date, value] pairs with zip, then convert to keyed object
        _.each(data, obj => {
            let indicatorData: MultiDataPoint[] = [];
            let indicator = obj.indicator;
            let timeFormat = this.timeOptions[obj.time_aggregation];
            let parseTime = D3.timeParse(timeFormat);

            _.each(obj.data, (values, key) => {
                indicatorData.push({
                    'date': parseTime(key),
                    'values': values
                } as MultiDataPoint);
            });

            if (!_.includes(indicators, indicator)) {
                indicators.push(indicator);
                chartData.push({
                    'indicator': indicator,
                    'data': indicatorData,
                    'time_aggregation': indicator.time_aggregation,
                    'time_format': timeFormat
                } as ChartData);
            }
        });

        return chartData;
    }
}
