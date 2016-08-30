import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// 3rd party modules
import { Ng2AutoCompleteModule } from './auto-complete/ng2AutoComplete.module';

// Platform and Environment providers/directives/pipes
import { PLATFORM_PROVIDERS } from '../platform/browser';
import { ENV_PROVIDERS } from '../platform/environment';

// Top-level app includes
import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { LabComponent } from './lab/lab.component';
import { PageNotFoundComponent } from './http-status/page-not-found/page-not-found.component';
import { ChartService } from './services/chart.service';
import { IndicatorsService } from './services/indicators.service';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    LabComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    Ng2AutoCompleteModule
  ],
  providers: [
    appRoutingProviders,
    PLATFORM_PROVIDERS,
    ENV_PROVIDERS,
    ChartService,
    IndicatorsService
  ]
})
export class AppModule {}
