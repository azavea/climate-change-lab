import { Component, OnInit, Input } from '@angular/core';

import { Scenario } from '../../models/scenario.model';
import { ProjectData } from '../../models/project-data.model';
import { ScenarioService } from '../../services/scenario.service';

/*  Scenario Dropdown Component

    -- Requires project input
    Expected use:
        <scenario-dropdown
            [projectData]="your_project.project_data">
*/

@Component({
  selector: 'scenario-dropdown',
  template: `<div dropdown class="dropdown dropdown-scenario">
              <button dropdownToggle class="button dropdown-toggle" type="button"
                id="scenarioDropdown" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="true">
                <i class="icon-flash"></i>
                {{ projectData.scenario.label || "Select Scenario" }}
                <i class="icon-angle-down caret"></i>
              </button>
              <ul *dropdownMenu class="dropdown-menu" aria-labelledby="scenarioDropdown">
                <li *ngFor="let scenario of scenarios">
                  <a (click)="onScenarioClicked(scenario)"
                    tooltip="{{ scenario.description }}"
                    placement="bottom">{{ scenario.label }}</a>
                </li>
              </ul>
            </div>`
})
export class ScenarioDropdownComponent implements OnInit {

    @Input() projectData: ProjectData;
    public scenarios: Scenario[] = [];
    private DEFAULT_SCENARIO_NAME: string = 'RCP85';

    constructor(private scenarioService: ScenarioService) {}

    ngOnInit() {
        this.getScenarios();
    }

    public onScenarioClicked(scenario: Scenario) {
        this.projectData.scenario = scenario;
    }

    private getScenarios() {
        this.scenarioService.list().subscribe(data => {
            this.scenarios = data;

            // Set a default for the project if none is set
            if (!this.projectData.scenario.label) {
                this.onScenarioClicked(this.scenarios.find((s) => {
                    return s.name === this.DEFAULT_SCENARIO_NAME;
                }));
            }
        });
    }
}
