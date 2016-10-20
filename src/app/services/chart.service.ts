import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ChartData, MultiDataPoint } from '../models/chart';

import * as moment from 'moment';
import * as _ from 'lodash';

/*
 * Chart Service
 * Data management and operations for charts
 */
@Injectable()
export class ChartService {

    private multiChartScrubberInfo = new Subject();
    private multiChartScrubberHover = new Subject<Boolean>();

    multiChartScrubberInfo$ = this.multiChartScrubberInfo.asObservable();
    multiChartScrubberHover$ = this.multiChartScrubberHover.asObservable();

    constructor() {}

    // receive and ship mousemove event
    updateMultiChartScrubberInfo(event) {
        this.multiChartScrubberInfo.next(event);
    }
    // receive and ship overlay mouseover status
    detectMultiChartHover(bool: Boolean) {
        this.multiChartScrubberHover.next(bool);
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
            _.each(obj.data, (values, key) => {
                indicatorData.push({
                    'date': key,
                    'values': values
                } as MultiDataPoint);
            });

            if (!_.includes(indicators, indicator)) {
                indicators.push(indicator);
                chartData.push({
                    'indicator': indicator,
                    'data': indicatorData,
                    'time_agg': indicator.time_aggregation
                } as ChartData);
            }
        });

        return chartData;
    }
}
