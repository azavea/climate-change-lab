
// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';

// RxJS
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

// 3rd Party Libraries
import 'jquery';
import 'ng2-bootstrap';
import 'lodash';
import 'd3';
import 'd3-tip';
import 'bootstrap';

if ('production' === ENV) {
  // Production


} else {
  // Development
  require('angular2-hmr');

}
