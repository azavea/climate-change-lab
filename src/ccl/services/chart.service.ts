import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";


@Injectable()
export class ChartService {
    // TODO rewrite as Subject type observable

    chartList = ["5 Day Rainfall"];

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
}

