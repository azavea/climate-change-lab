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

import * as cloneDeep from 'lodash.clonedeep';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
  Chart,
  ChartData,
  ChartService,
  City,
  ClimateModel,
  Dataset,
  IndicatorDistanceRequestOpts,
  IndicatorDistanceQueryParams,
  IndicatorService,
  Scenario,
  TimeAggParam,
  isBasetempIndicator,
  isHistoricIndicator,
  isPercentileIndicator,
  isThresholdIndicator,
} from 'climate-change-components';

import { AuthService } from '../auth/auth.service';
import { DataExportService } from '../services/data-export.service';
import { ImageExportService } from '../services/image-export.service';

import { environment } from '../../environments/environment';

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
    @Output() onExtraParamsChanged = new EventEmitter<IndicatorDistanceQueryParams>();

    @Input() chart: Chart;
    @Input() dataset: Dataset;
    @Input() scenario: Scenario;
    @Input() models: ClimateModel[];
    @Input() city: City;
    @Input() unit: string;
    @Input() extraParams: IndicatorDistanceQueryParams;

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
    public isHistoricIndicator = isHistoricIndicator;
    public isPercentileIndicator = isPercentileIndicator;

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
        // happens if different chart selected
        if (!this.scenario || !this.city || !this.city.properties || !this.models || !this.dataset) { return; }
        this.updateChart($event);
    }

    ngOnDestroy() {
        this.cancelDataRequest();
    }

    updateChart(extraParams: IndicatorDistanceQueryParams) {
        this.cancelDataRequest();
        this.chartData = [];
        this.rawChartData = [];

        const params: IndicatorDistanceQueryParams = {
            climateModels: this.models.filter(model => model.enabled),
            dataset: this.dataset.name,
            unit: this.unit || this.chart.indicator.default_units,
            time_aggregation: TimeAggParam.Yearly,
            distance: environment.distance
        }

        Object.assign(params, this.extraParams);

        const queryOpts: IndicatorDistanceRequestOpts = {
            indicator: this.chart.indicator,
            scenario: this.scenario,
            params: params
        };

        this.dateRange = [this.firstYear, this.lastYear]; // reset time slider range
        const future = this.indicatorService.getDataForLatLon(
          this.city.geometry,
          queryOpts,
        );
        queryOpts.scenario = this.historicalScenario;
        const historical = this.indicatorService.getDataForLatLon(
          this.city.geometry,
          queryOpts,
        );
        this.dataSubscription = Observable.forkJoin(
            historical,
            future
        ).subscribe(data => {
            const chartQueryHistorical = data[0].url;
            const chartQueryFuture = data[1].url;
            this.rawChartData = data;
            this.processedData = this.chartService.convertChartData(data);
            this.chartData = cloneDeep(this.processedData);

            this.curlCommandHistorical = `curl -i "${chartQueryHistorical}" -H "Authorization: Token ` +
                               `${this.authService.getToken()}"`;
            this.curlCommandFuture = `curl -i "${chartQueryFuture}" -H "Authorization: Token ` +
                               `${this.authService.getToken()}"`;
        });
    }

    sliceChartData() {
        this.chartData = cloneDeep(this.processedData); // to trigger change detection
        const startYear = this.dateRange[0];
        const endYear = this.dateRange[1];
        this.chartData[0]['data'] = this.chartData[0]['data'].filter(obj => {
            const year = obj['date'].getFullYear();
            return year >= startYear && year <= endYear;
        });
    }

    onExportClicked() {
        const historicalData = this.rawChartData[0];
        const historicalFilename = `historical-${historicalData.indicator.name}.json`;
        this.dataExportService.downloadAsJSON(historicalFilename, historicalData);
        const futureData = this.rawChartData[1];
        const futureFilename = `future-${futureData.indicator.name}.json`;
        this.dataExportService.downloadAsJSON(futureFilename, futureData);
    }

    onDownloadImageClicked() {
        const fileName: string = [
            this.chart.indicator.name,
            this.city.properties.name,
            this.dataset.name,
            this.scenario.name
        ].join('_');

        this.imageExportService.downloadAsPNG(this.chart.indicator.name, fileName);
    }

    public onExtraParamsSelected(params: IndicatorDistanceQueryParams) {
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
