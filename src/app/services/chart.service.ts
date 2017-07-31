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

    private timeOptions = {
          'yearly': '%Y',
          'daily': '%Y-%m-%d',
          'monthly': '%Y-%m'
        };

    constructor() {}

    // return an array of date strings for each day in the given year
    getDaysInYear(year: number): string[] {
        const oneDate = moment.utc(+year + '-01-01', 'YYYY-MM-DD', true);
        const days: string[] = [];
        while (oneDate.get('year') === year) {
            days.push(oneDate.format('YYYY-MM-DD'));
            oneDate.add(1, 'day');
        }
        return days;
    }

    // map array of IndicatorService.getData responses to date for each data point
    // and drop top-level year key
    convertChartData(data: any): ChartData[] {
        const indicators = [];
        const chartData: ChartData[] = [];

         // make array of [date, value] pairs with zip, then convert to keyed object
        _.each(data, obj => {
            const indicatorData: MultiDataPoint[] = [];
            const indicator = obj.indicator;
            const timeFormat = this.timeOptions[obj.time_aggregation];
            const parseTime = D3.timeParse(timeFormat);

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
                    'time_aggregation': obj.time_aggregation,
                    'time_format': timeFormat
                } as ChartData);
            }
        });

        return chartData;
    }
}
