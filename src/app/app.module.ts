// Angular imports
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

// 3rd party modules
import {
    CollapseModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    TooltipModule } from 'ngx-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch/src';
import { ClipboardModule } from 'ngx-clipboard';
import { NouisliderModule } from 'ng2-nouislider';

// App routing
import { routing, appRoutingProviders } from './app.routing';

// App Modules
import { Ng2AutoCompleteModule } from './ng2-auto-complete/ng2AutoComplete.module';

// Lab Components
import {
  CityDropdownComponent,
  LabComponent,
  ModelModalComponent,
  DatasetToggleComponent,
  ScenarioToggleComponent,
  UnitsDropdownComponent } from './lab';

// App Components
import { AppComponent } from './app.component';
import { AddEditProjectComponent } from './project/add-edit-project.component';
import { BasetempComponent } from './charts/extra-params-components/basetemp.component';
import { ChartComponent } from './charts/chart.component';
import { CopyCurlComponent } from './charts/copy-curl.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoricComponent } from './charts/extra-params-components/historic.component';
import { IndicatorListComponent } from './sidebar/indicator-list.component';
import { LineGraphComponent } from './charts/line-graph.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './http-status/page-not-found/page-not-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WaveComponent } from './ng2-spin-kit/wave.component';

import { ThresholdComponent,
         PercentileComponent } from './charts/extra-params-components/';

// App services
import { ApiHttp } from './auth/api-http.service';
import { apiHttpProvider } from './auth/api-http.provider';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { ChartService } from './services/chart.service';
import { DataExportService } from './services/data-export.service';
import { DatasetService } from './services/dataset.service';
import { ImageExportService } from './services/image-export.service';
import { ClimateModelService } from './services/climate-model.service';
import { HistoricRangeService } from './services/historic-range.service';
import { IndicatorService } from './services/indicator.service';
import { ScenarioService } from './services/scenario.service';
import { ProjectService } from './services/project.service';

// Custom app providers
const locationStrategyProvider = {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
};

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    BasetempComponent,
    WaveComponent,
    ThresholdComponent,
    HistoricComponent,
    CopyCurlComponent,
    PercentileComponent,
    ChartComponent,
    DashboardComponent,
    IndicatorListComponent,
    LabComponent,
    LineGraphComponent,
    NavbarComponent,
    SidebarComponent,
    PageNotFoundComponent,
    LoginComponent,
    AddEditProjectComponent,
    DatasetToggleComponent,
    ScenarioToggleComponent,
    ModelModalComponent,
    CityDropdownComponent,
    UnitsDropdownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    Ng2AutoCompleteModule,
    UiSwitchModule,
    ClipboardModule,
    NouisliderModule
  ],
  providers: [
    appRoutingProviders,
    locationStrategyProvider,
    apiHttpProvider,
    AuthService,
    AuthGuard,
    ChartService,
    DataExportService,
    DatasetService,
    ImageExportService,
    ClimateModelService,
    HistoricRangeService,
    IndicatorService,
    ScenarioService,
    ProjectService
  ]
})
export class AppModule {}
