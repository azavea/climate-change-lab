/*
    Experimental: Not entirely sure how useful this helper library and service will be,
    depends on how invested we are in hot module replacement and if webpack is sufficient
    or not, yet to be tested
*/
import {HmrState} from 'angular2-hmr';

export class AppState {
  // @HmrState() is used by HMR to track the state of any object during a hot module replacement
  @HmrState() _state = { };
}