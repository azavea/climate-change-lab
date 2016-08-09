import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { ChartService } from '../services/chart.service';
import { LineGraph } from './line-graph.component';
import { ChartConfig } from './chart-config.component';

/*
 * Chart component
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
    private chartConfig: Array<ChartConfig>;

    makeChart() {
      this.getChartData.subscribe(data=> {
        this.chartConfig = data;
      });
    }

    constructor(@Inject(ChartService) chartService:ChartService){
      this.chartList = chartService.get();
      this.getChartData = chartService.getChartData();
      this.makeChart();
    }

}