import { Directive } from '@angular/core';


@Directive({
  selector: 'chart-config'
})

export class ChartConfig {

    private settings: Object;
    private dataset: Array<any>;

    constructor() {
      this.settings = {};
      this.dataset = [];
    }
}