import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Chart } from '../models/chart.model';
import { ChartData } from '../models/chart-data.model';
import { City } from '../models/city.model';
import { ClimateModel } from '../models/climate-model.model';
import { IndicatorRequestOpts } from '../models/indicator-request-opts.model';
import { IndicatorQueryParams } from '../models/indicator-query-params.model';
import { Scenario } from '../models/scenario.model';
import { TimeAggParam } from '../models/time-agg-param.enum';

import { AuthService } from '../auth/auth.service';
import { ChartService } from '../services/chart.service';
import { IndicatorService } from '../services/indicator.service';
import { DataExportService } from '../services/data-export.service';
import { ImageExportService } from '../services/image-export.service';

import { isBasetempIndicator,
         isThresholdIndicator } from '../charts/extra-params-components/extra-params.constants';

import * as _ from 'lodash';

/*
 * Chart component
 * Container for each individual chart plus controls
 */
@Component({
  selector: 'ccl-chart', // if this selector is renamed, image export service must also be updated
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnChanges, OnDestroy, AfterViewInit {

    @Output() onRemoveChart = new EventEmitter<Chart>();
    @Output() onExtraParamsChanged = new EventEmitter<IndicatorQueryParams>();

    @Input() chart: Chart;
    @Input() scenario: Scenario;
    @Input() models: ClimateModel[];
    @Input() city: City;
    @Input() unit: string;
    @Input() extraParams: IndicatorQueryParams;

    private processedData: ChartData[];
    public chartData: ChartData[];
    public rawChartData: any;
    public isHover: Boolean = false;
    public curlCommandHistorical: String;
    public curlCommandFuture: String;
    private historicalScenario: Scenario = {
        name: 'historical',
        label: 'Historical',
        description: ''
    };
    private firstYear = 1950;
    private lastYear = 2100;
    public dateRange: number[] = [this.firstYear, this.lastYear];
    public isThresholdIndicator = isThresholdIndicator;
    public isBasetempIndicator = isBasetempIndicator;
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
    private dataSubscription: Subscription;


    // Mousemove event must be at this level to listen to mousing over rect#overlay
    @HostListener('mouseover', ['$event'])
    onMouseOver(event) {
        this.isHover = event.target.id === 'overlay' ? true : false;
    }

    constructor(private chartService: ChartService,
                private indicatorService: IndicatorService,
                private dataExportService: DataExportService,
                private imageExportService: ImageExportService,
                private authService: AuthService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        // Manually trigger change detection in parent to avoid
        // ExpressionChangedAfterItHasBeenCheckedError when extra params form
        // calls to set initial values in ngAfterViewInit.
        this.changeDetector.detectChanges();
    }

    ngOnChanges($event) {
        if (!this.scenario || !this.city || !this.models) { return; }
        // happens if different chart selected
        this.updateChart($event);
    }

    ngOnDestroy() {
        this.cancelDataRequest();
    }

    updateChart(extraParams: IndicatorQueryParams) {
        this.cancelDataRequest();
        this.chartData = [];
        this.rawChartData = [];

        let params: IndicatorQueryParams = {
            climateModels: this.models,
            unit: this.unit || this.chart.indicator.default_units,
            time_aggregation: TimeAggParam.Yearly
        }

        params = _.extend(params, this.extraParams);

        const queryOpts: IndicatorRequestOpts = {
            indicator: this.chart.indicator,
            scenario: this.scenario,
            city: this.city,
            params: params
        };

        this.dateRange = [this.firstYear, this.lastYear]; // reset time slider range
        const future = this.indicatorService.getData(queryOpts);
        queryOpts.scenario = this.historicalScenario;
        const historical = this.indicatorService.getData(queryOpts);
        this.dataSubscription = Observable.forkJoin(
            historical,
            future
        ).subscribe(data => {
            const chartQueryHistorical = data[0].url;
            const chartQueryFuture = data[1].url;
            delete data[1].url; // apart from URL, returned data is raw query response
            this.rawChartData = data[1];
            this.processedData = this.chartService.convertChartData(data);
            this.chartData = _.cloneDeep(this.processedData);

            this.curlCommandHistorical = `curl -i "${chartQueryHistorical}" -H "Authorization: Token ` +
                               `${this.authService.getToken()}"`;
            this.curlCommandFuture = `curl -i "${chartQueryFuture}" -H "Authorization: Token ` +
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

    public onThresholdSelected(params: IndicatorQueryParams) {
        this.extraParams = params;
        this.onExtraParamsChanged.emit(this.extraParams);
        this.updateChart(this.extraParams);
    }

    removeChart(chart: Chart) {
        this.onRemoveChart.emit(chart);
    }

    private cancelDataRequest() {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }
}
