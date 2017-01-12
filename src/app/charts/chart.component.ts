import { Component, EventEmitter, OnChanges, Input, Output, HostListener } from '@angular/core';

import { Chart } from '../models/chart.model';
import { ChartData } from '../models/chart-data.model';
import { City } from '../models/city.model';
import { ClimateModel } from '../models/climate-model.model';
import { Scenario } from '../models/scenario.model';

import { ChartService } from '../services/chart.service';
import { IndicatorService } from '../services/indicator.service';
import { CSVService } from '../services/csv.service';
import { SocialService } from '../services/social.service';


/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnChanges {

    @Output() onRemoveChart = new EventEmitter<Chart>();

    @Input() chart: Chart;
    @Input() scenario: Scenario;
    @Input() models: ClimateModel[];
    @Input() city: City;
    @Input() multiChartScrubber: Boolean;

    private chartData: ChartData[];
    private isHover: Boolean = false;

    // Mousemove event must be at this level to listen to mousing over rect#overlay
    @HostListener('mouseover', ['$event'])
    onMouseOver(event) {
        this.isHover = event.target.id === 'overlay' ? true : false;
        if (this.multiChartScrubber) {
            this.chartService.detectMultiChartHover(this.isHover);
        }
    }

    constructor(private chartService: ChartService,
                private indicatorService: IndicatorService,
                private csvService: CSVService,
                private socialService: SocialService) {}

    ngOnChanges() {
        if (!this.scenario || !this.city || !this.models) { return; }
        this.chartData = [];
        this.indicatorService.getData({
            indicator: this.chart.indicator,
            scenario: this.scenario,
            city: this.city,
            climateModels: this.models,
            // As a temporary solution, the time agg defaults to the 1st valid option.
            // Really, this should a user selectable option
            time_aggregation: this.chart.indicator.valid_aggregations[0]
        }).subscribe(data => this.chartData = this.chartService.convertChartData([data]));
    }

    onSettingsToggleClicked() {
        this.chart.showSettings = !this.chart.showSettings;
    }

    onExportClicked() {
        this.csvService.downloadAsCSV(this.chartData);
    }

    onDownloadImageClicked() {
        let fileName: string = [
            this.chart.indicator.name,
            // typescript checker complains if dot notation used on properties object
            this.city.properties['name'],
            this.scenario.name
        ].join('_');

        this.socialService.downloadAsPNG(this.chart.indicator.name, fileName);
    }

    removeChart(chart: Chart) {
        this.onRemoveChart.emit(chart);
    }
}
