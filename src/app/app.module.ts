// Angular imports
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

// 3rd party modules
import {
    BsDropdownModule,
    CollapseModule,
    ModalModule,
    TooltipModule } from 'ngx-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { NouisliderModule } from 'ng2-nouislider';

// Shared modules
import { ApiModule, ChartsModule } from 'climate-change-components';

// App routing
import { routing, appRoutingProviders } from './app.routing';

// App Modules
import { Ng2AutoCompleteModule } from './ng2-auto-complete/ng2AutoComplete.module';

// Lab Components
import { CityDropdownComponent, LabComponent } from './lab';

// App Components
import { AppComponent } from './app.component';
import { AddEditProjectComponent } from './project/add-edit-project.component';
import { ChartComponent } from './charts/chart.component';
import { CopyCurlComponent } from './charts/copy-curl.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndicatorListComponent } from './sidebar/indicator-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './http-status/page-not-found/page-not-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WaveComponent } from './ng2-spin-kit/wave.component';

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
    WaveComponent,
    CopyCurlComponent,
    ChartComponent,
    DashboardComponent,
    IndicatorListComponent,
    LabComponent,
    NavbarComponent,
    SidebarComponent,
    PageNotFoundComponent,
    AddEditProjectComponent,
    CityDropdownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    Ng2AutoCompleteModule,
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
