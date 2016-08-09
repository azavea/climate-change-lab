import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Http, Response} from '@angular/http';

@Injectable()
export class ChartService {
    constructor(private http: Http) { }

    // TODO rewrite as Subject type observable
    chartList = ["5 Day Rainfall", "Total Precipitation"];

    get() {
        return this.chartList;
    }

    removeChart(indicator) {
        this.chartList.filter(function(i){
            return i !== indicator;
        });
    }

    addChart(indicator){
        // TODO: Only update chartList observable upon new indicator
        if (!this.chartList.includes(indicator)){
            this.chartList.push(indicator);
        }
        console.log(this.chartList);
    }

    getChartData() {
        return this.http.get('/assets/mockdata/d3_precip_graph_data.json')
          .map(response => response.json());
    }
}
