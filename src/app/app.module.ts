// Angular imports
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

// 3rd party modules
import {
    CollapseModule,
    DropdownModule,
    ModalModule,
    TooltipModule,
    TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';
import { UiSwitchModule } from 'angular2-ui-switch';

// App routing
import { routing, appRoutingProviders } from './app.routing';

// App Modules
import { Ng2AutoCompleteModule } from './ng2-auto-complete/ng2AutoComplete.module';

// App Components
import { AppComponent } from './app.component';
import { ChartComponent } from './charts/chart.component';
import { ChartsContainerComponent } from './charts/charts-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LabComponent } from './lab/lab.component';
import { LineGraphComponent } from './charts/line-graph.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './http-status/page-not-found/page-not-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WaveComponent } from './ng2-spin-kit/wave.component';

// App services
import { ApiHttp } from './auth/api-http.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { ChartService } from './services/chart.service';
import { IndicatorService } from './services/indicator.service';

// Custom app providers
let LocationStrategyProvider = {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
};
let ApiHttpProvider = {
    provide: ApiHttp,
    useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, authService: AuthService) => {
        return new ApiHttp(xhrBackend, requestOptions, authService)
    },
    deps: [XHRBackend, RequestOptions, AuthService]
};

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    WaveComponent,
    ChartComponent,
    ChartsContainerComponent,
    DashboardComponent,
    LabComponent,
    LineGraphComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    CollapseModule,
    DropdownModule,
    ModalModule,
    TooltipModule,
    Ng2AutoCompleteModule,
    UiSwitchModule
  ],
  providers: [
    appRoutingProviders,
    LocationStrategyProvider,
    ApiHttpProvider,
    AuthService,
    AuthGuard,
    ChartService,
    IndicatorService
  ]
})
export class AppModule {}
