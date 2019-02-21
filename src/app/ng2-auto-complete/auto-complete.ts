import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { LabApiHttp } from '../auth/api-http.service';

/**
 * provides auto-complete related utility functions
 */
@Injectable()
export class AutoComplete {

  public source: string;
  public pathToData: string;

  constructor(private apiHttp: LabApiHttp) {
    // ...
  }

  filter(list: any[], keyword: string) {
    return list.filter(
      el => {
        return !!JSON.stringify(el).match(new RegExp(keyword, 'i'));
      }
    );
  }

  /**
   * return remote data from the given source and options, and data path
   *
   * @param {*} options is an object containing the query paramters for the GET call
   * @returns {Observable<Response>}
   *
   * @memberOf AutoComplete
   */
  getRemoteData(options: any): Observable<Response> {

    let keyValues: any[] = [];
    let url = '';

    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        // replace all keyword to value
        let regexp: RegExp = new RegExp(':' + key, 'g');

        url = this.source;
        if (url.match(regexp)) {
          url = url.replace(regexp, options[key]);
        } else {
          keyValues.push(key + '=' + options[key]);
        }
      }
    }

    if (keyValues.length) {
      let qs = keyValues.join('&');
      url += url.match(/\?[a-z]/i) ? qs : ('?' + qs);
    }

    return this.apiHttp.get(url)
      .map(resp => resp.json())
      .map(resp => {
        let list = resp.data || resp;
        if (this.pathToData) {
          let paths = this.pathToData.split('.');
          paths.forEach(prop => list = list[prop]);
        }

        return list;
      });
  };
}

