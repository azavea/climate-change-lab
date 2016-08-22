/*
 * Providers provided by Angular
 */
import { bootstrap } from '@angular/platform-browser-dynamic';
/*
* Platform and Environment
* our providers/directives/pipes
*/
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PLATFORM_PROVIDERS } from './platform/browser';
import { ENV_PROVIDERS, decorateComponentRef } from './platform/environment';

import { ClimateChangeModule } from './ccl/app.module';

import './assets/sass/main.scss';
import './assets/fonts/fontello/css/mantle.css';

/*
* App Component
* our top level component that holds all of our components
*/
import { ChartService } from './ccl/services/chart.service';

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main(initialHmrState?: any): Promise<any> {

  return platformBrowserDynamic().bootstrapModule(ClimateChangeModule, [
    ChartService
  ])
  .then(decorateComponentRef)
  .catch(err => console.error(err));

}

/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * You can also import them in vendors to ensure that they are bundled in one file
 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
 */

document.addEventListener('DOMContentLoaded', () => main());
