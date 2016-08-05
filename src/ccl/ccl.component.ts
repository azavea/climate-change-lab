/*
 * Climate Change Lab
 * App Component
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Sidebar } from './sidebar/sidebar.component';
import { Chart } from './charts/chart.component';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'ccl',
  directives: [Sidebar, Chart],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../assets/css/main.css',
  ],
  templateUrl: './ccl.template.html'
})
export class ClimateChangeLab {
  name = 'Climate Lab';

}