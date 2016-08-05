import { Component, ViewEncapsulation } from '@angular/core';
import { ChartService } from '../services/chart.service';
/*
 * Chart component
 */

@Component({
  selector: 'chart',
  encapsulation: ViewEncapsulation.None,
  providers: [ChartService],
  styleUrls: [
  '../../assets/css/chart.css',
  ],
  templateUrl: './chart.template.html'
})
export class Chart {
    // Pull active chart data
    private chartList;

    constructor(chartService: ChartService){
        this.chartList = chartService.get();
    }

}