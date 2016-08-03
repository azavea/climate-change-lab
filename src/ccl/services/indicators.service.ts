import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';


@Injectable()
export class IndicatorsService {
  constructor(private http: Http) { }

  get() {
    return this.http.get('/assets/indicators.json')
      .map(response => response.json());
  }
}