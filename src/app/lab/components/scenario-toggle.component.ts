import { Component, OnInit, Input } from '@angular/core';

import { Scenario } from '../../models/scenario.model';
import { ProjectData } from '../../models/project-data.model';
import { ScenarioService } from '../../services/scenario.service';

/*  Scenario Toggle Component

    -- Requires project input
    Expected use:
        <ccl-scenario-toggle
            [projectData]="your_project.project_data">
*/

@Component({
  selector: 'ccl-scenario-toggle',
  template: `
    <div class="dropdown button-group">
        <button class="button"
               *ngFor="let s of scenarios"
               [ngClass]="{'active': s.name === projectData.scenario.name}"
               (click)="onScenarioClicked(s, $event)">
            {{ s.label }}
        </button>
    </div>
  `

})
export class ScenarioToggleComponent implements OnInit {

    @Input() projectData: ProjectData;
    public scenarios: Scenario[] = [];
    private DEFAULT_SCENARIO_NAME = 'RCP85';
    private VALID_SCENARIOS = ['RCP85', 'RCP45'];

    constructor(private scenarioService: ScenarioService) {}

    ngOnInit() {
        this.getScenarios();
    }

    public onScenarioClicked(scenario: Scenario, event?: Event) {
        this.projectData.scenario = scenario;
        if (event) {
            event.preventDefault();
        }
    }

    private getScenarios() {
        this.scenarioService.list().subscribe(data => {
            this.scenarios = data.filter(s => this.VALID_SCENARIOS.includes(s.name));

            // Set a default for the project if none is set
            if (!this.projectData.scenario.label) {
                this.onScenarioClicked(this.scenarios.find((s) => {
                    return s.name === this.DEFAULT_SCENARIO_NAME;
                }));
            }
        });
    }
}
