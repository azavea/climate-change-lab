import {HmrState} from 'angular2-hmr';

export class AppState {
  // @HmrState() is used by HMR to track the state of any object during a hot module replacement
  @HmrState() _state = { };
}