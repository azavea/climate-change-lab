import { Component, EventEmitter, OnChanges, Input, Output, HostListener } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Chart } from '../models/chart.model';
import { ChartData } from '../models/chart-data.model';
import { City } from '../models/city.model';
import { ClimateModel } from '../models/climate-model.model';
import { Scenario } from '../models/scenario.model';

import { AuthService } from '../auth/auth.service';
import { ChartService } from '../services/chart.service';
import { IndicatorService } from '../services/indicator.service';
import { DataExportService } from '../services/data-export.service';
import { ImageExportService } from '../services/image-export.service';

import * as _ from 'lodash';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'ccl-chart', // if this selector is renamed, image export service must also be updated
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnChanges {

    @Output() onRemoveChart = new EventEmitter<Chart>();

    @Input() chart: Chart;
    @Input() scenario: Scenario;
    @Input() models: ClimateModel[];
    @Input() city: City;
    @Input() unit: string;

    private processedData: ChartData[];
    public chartData: ChartData[];
    public rawChartData: any;
    public isHover: Boolean = false;
    public curlCommand: String;
    private historicalScenario: Scenario = {
        name: 'historical',
        label: 'Historical',
        description: ''
    };
    private firstYear = 1950;
    private lastYear = 2100;
    public dateRange: number[] = [this.firstYear, this.lastYear];
    public sliderConfig: any = {
        behaviour: 'drag',
        connect: true,
        margin: 1,
        step: 1,
        limit: 150,
        range: {
          min: 1950,
          max: 2100
        },
        pips: {
          mode: 'count',
          values: 6,
          density: 6
        }
      };


    // Mousemove event must be at this level to listen to mousing over rect#overlay
    @HostListener('mouseover', ['$event'])
    onMouseOver(event) {
        this.isHover = event.target.id === 'overlay' ? true : false;
    }

    constructor(private chartService: ChartService,
                private indicatorService: IndicatorService,
                private dataExportService: DataExportService,
                private imageExportService: ImageExportService,
                private authService: AuthService) {}

    ngOnChanges() {
        if (!this.scenario || !this.city || !this.models) { return; }
        this.chartData = [];
        this.rawChartData = [];
        const queryOpts = {
            indicator: this.chart.indicator,
            scenario: this.scenario,
            city: this.city,
            climateModels: this.models,
            unit: this.unit || this.chart.indicator.default_units,
            // As a temporary solution, the time agg defaults to the 1st valid option.
            // Really, this should a user selectable option
            time_aggregation: this.chart.indicator.valid_aggregations[0]
        };
        this.dateRange = [this.firstYear, this.lastYear]; // reset time slider range
        const future = this.indicatorService.getData(queryOpts);
        queryOpts.scenario = this.historicalScenario;
        const historical = this.indicatorService.getData(queryOpts);
        Observable.forkJoin(
            historical,
            future
        ).subscribe(data => {
            const chartQuery = data[1].url;
            delete data[1].url; // apart from URL, returned data is raw query response
            this.rawChartData = data[1];
            this.processedData = this.chartService.convertChartData(data);
            this.chartData = _.cloneDeep(this.processedData);

            this.curlCommand = `curl -i "${chartQuery}" -H "Authorization: Token ` +
                               `${this.authService.getToken()}"`;
        });
    }

    sliceChartData() {
        this.chartData = _.cloneDeep(this.processedData); // to trigger change detection
        const startYear = this.dateRange[0];
        const endYear = this.dateRange[1];
        this.chartData[0]['data'] = (this.chartData[0]['data']).filter(obj => {
            const year = obj['date'].getFullYear()
            return year >= startYear && year <= endYear
        });
    }

    onExportClicked() {
        this.dataExportService.downloadAsJSON(this.rawChartData);
    }

    onDownloadImageClicked() {
        const fileName: string = [
            this.chart.indicator.name,
            this.city.properties.name,
            this.scenario.name
        ].join('_');

        this.imageExportService.downloadAsPNG(this.chart.indicator.name, fileName);
    }

    curlCommandCopied(copiedPopup) {
        // show a confirmation tooltip, then hide it again after a second
        copiedPopup.show();
        setTimeout(() => { copiedPopup.hide(); }, 1000);
    }

    removeChart(chart: Chart) {
        this.onRemoveChart.emit(chart);
    }
}
