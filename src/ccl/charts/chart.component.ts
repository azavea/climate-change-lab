import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { ChartService } from '../services/chart.service';
import { LineGraph } from './line-graph.component';

/*
 * Chart component
 * Management for the sections that appear in the chart container
 */

@Component({
  selector: 'charts',
  encapsulation: ViewEncapsulation.None,
  providers: [ChartService],
  directives: [LineGraph],
  styleUrls: [
  '../../assets/css/chart.css',
  ],
  templateUrl: './chart.template.html'
})
export class Chart {
    // Pull active chart data
    public chartService: ChartService;
    private chartList;
    private getChartData;

    // Create graph
    private chartData;

    makeCharts() {
      this.getChartData.subscribe(data=> {
        this.chartData = data;
      });
    }

    constructor(@Inject(ChartService) chartService:ChartService){
      this.chartList = chartService.get();
      this.getChartData = chartService.getChartData();
      this.makeCharts();
    }

}