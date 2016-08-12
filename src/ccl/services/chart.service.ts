import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import { ChartData } from '../models/chart.models';

/*
 * Chart Service
 * Data management and operations for charts
 */

@Injectable()
export class ChartService {
    constructor(private http: Http) {}

    chartList = ["Total Precipitation"];

    get() {
        return this.chartList;
    }

    removeChart(indicator) {
        // TODO: Hook up to chart delete button
        this.chartList.filter(function(i){
            return i !== indicator;
        });
    }

    addChart(indicator){
        // Only update chartList upon new indicator
        if (!this.chartList.includes(indicator)){
            this.chartList.push(indicator);
        }
    }

    getChartData() {
        // TODO: Rewrite to poll for API data
        return this.http.get('/assets/mockdata/d3_precip_graph_data.json')
          .map(response => response.json() as ChartData);
    }
}
