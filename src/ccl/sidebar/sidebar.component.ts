/*
 * Climate Change Lab
 * Sidebar component
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { IndicatorsService } from '../services/indicators.service';


@Component({
  selector: 'sidebar',
  providers: [IndicatorsService],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
      '../../assets/css/main.css',
  ],
  templateUrl: './sidebar.template.html'
})
export class Sidebar {

    private indicatorsList;

    constructor(indicators: IndicatorsService){
        indicators.get()
        .subscribe(data=>this.indicatorsList=data);
    }

    ngOnInit(){
    }
}
