import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/*
 * Platform and Environment providers/directives/pipes
 */
import { PLATFORM_PROVIDERS } from '../platform/browser';
import { ENV_PROVIDERS } from '../platform/environment';

// ccl is our top level component
import { ClimateChangeLab } from './ccl.component';

/**
 * `ClimateChangeModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ ClimateChangeLab ],
  declarations: [
    ClimateChangeLab
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    PLATFORM_PROVIDERS,
    ENV_PROVIDERS
  ]
})
export class ClimateChangeModule {
}
