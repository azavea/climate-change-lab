import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

/*
 * Indicators Service
 * Returns climate indicators. Used by the sidebar.
 */

@Injectable()
export class IndicatorsService {
  constructor(private http: Http) {}

  get() {
    return this.http.get('/assets/indicators.json')
      .map(response => response.json());
  }
}