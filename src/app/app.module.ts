// Angular imports
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

// 3rd party modules
import {
    CollapseModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    TooltipModule } from 'ngx-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch/src';

// App routing
import { routing, appRoutingProviders } from './app.routing';

// App Modules
import { Ng2AutoCompleteModule } from './ng2-auto-complete/ng2AutoComplete.module';

// App Components
import { AppComponent } from './app.component';
import { AddEditProjectComponent } from './project/add-edit-project.component';
import { ChartComponent } from './charts/chart.component';
import { CityDropdownComponent } from './lab/dropdowns/city-dropdown.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndicatorListComponent } from './sidebar/indicator-list.component';
import { LabComponent } from './lab/lab.component';
import { LineGraphComponent } from './charts/line-graph.component';
import { LoginComponent } from './login/login.component';
import { ModelModalComponent } from './lab/dropdowns/model-modal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './http-status/page-not-found/page-not-found.component';
import { ScenarioDropdownComponent } from './lab/dropdowns/scenario-dropdown.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WaveComponent } from './ng2-spin-kit/wave.component';

// App services
import { ApiHttp } from './auth/api-http.service';
import { apiHttpProvider } from './auth/api-http.provider';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { ChartService } from './services/chart.service';
import { CSVService } from './services/csv.service';
import { ImageExportService } from './services/image-export.service';
import { ClimateModelService } from './services/climate-model.service';
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
    WaveComponent,
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
    ScenarioDropdownComponent,
    ModelModalComponent,
    CityDropdownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    Ng2AutoCompleteModule,
    UiSwitchModule
  ],
  providers: [
    appRoutingProviders,
    locationStrategyProvider,
    apiHttpProvider,
    AuthService,
    AuthGuard,
    ChartService,
    CSVService,
    ImageExportService,
    ClimateModelService,
    IndicatorService,
    ScenarioService,
    ProjectService
  ]
})
export class AppModule {}
