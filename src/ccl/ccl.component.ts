/*
 * Climate Change Lab
 * App Component
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { Sidebar } from './sidebar/sidebar.component';
import { Charts } from './charts/charts-container.component';


@Component({
  selector: 'ccl',
  directives: [Sidebar, Charts],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './ccl.style.css',
  ],
  templateUrl: './ccl.template.html'
})
export class ClimateChangeLab {
  name = 'Climate Lab';
}