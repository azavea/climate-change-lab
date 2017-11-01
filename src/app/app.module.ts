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
    PaginationModule,
    TooltipModule } from 'ngx-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch/src';
import { ClipboardModule } from 'ngx-clipboard';
import { NouisliderModule } from 'ng2-nouislider';

// Shared modules
import { ApiModule, ChartsModule } from 'climate-change-components';

// App routing
import { routing, appRoutingProviders } from './app.routing';

// App Modules
import { Ng2AutoCompleteModule } from './ng2-auto-complete/ng2AutoComplete.module';

// Lab Components
import {
  CityDropdownComponent,
  LabComponent,
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
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './http-status/page-not-found/page-not-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WaveComponent } from './ng2-spin-kit/wave.component';

import { ThresholdComponent,
         PercentileComponent } from './charts/extra-params-components/';

// App services
import { apiHttpProvider } from './auth/api-http.provider';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';

import { DataExportService } from './services/data-export.service';
import { ImageExportService } from './services/image-export.service';
import { ProjectService } from './services/project.service';

import { apiHost } from './constants';

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
    NavbarComponent,
    SidebarComponent,
    PageNotFoundComponent,
    LoginComponent,
    AddEditProjectComponent,
    ScenarioToggleComponent,
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
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    Ng2AutoCompleteModule,
    UiSwitchModule,
    ClipboardModule,
    NouisliderModule,
    ApiModule.forRoot({
      apiHost: apiHost,
      apiHttpInjectionToken: apiHttpProvider.provide
    }),
    ChartsModule
  ],
  providers: [
    appRoutingProviders,
    locationStrategyProvider,
    apiHttpProvider,
    AuthService,
    AuthGuard,
    DataExportService,
    ImageExportService,
    ProjectService
  ]
})
export class AppModule {}
