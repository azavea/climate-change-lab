import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { Scenario, ScenarioService } from 'climate-change-components';

/*  Scenario Toggle Component

    -- Requires project input
    Expected use:
        <ccl-scenario-toggle
            [scenario]="yourScenario">
*/

@Component({
  selector: 'ccl-scenario-toggle',
  templateUrl: './scenario-toggle.component.html'
})
export class ScenarioToggleComponent implements OnInit {

    @Input() scenario: Scenario;
    @Output() onScenarioSelected = new EventEmitter<Scenario>();
    public scenarios: Scenario[] = [];
    private DEFAULT_SCENARIO_NAME = 'RCP85';
    private VALID_SCENARIOS = ['RCP85', 'RCP45'];

    constructor(private scenarioService: ScenarioService) {}

    ngOnInit() {
        this.getScenarios();
    }

    public onScenarioClicked(scenario: Scenario, event?: Event) {
        this.scenario = scenario;
        if (event) {
            event.preventDefault();
        }
        this.onScenarioSelected.emit(scenario);
    }

    private getScenarios() {
        this.scenarioService.list().subscribe(data => {
            this.scenarios = data.filter(s => this.VALID_SCENARIOS.includes(s.name));

            // Set a default for the project if none is set
            if (!this.scenario.label) {
                this.onScenarioClicked(this.scenarios.find((s) => {
                    return s.name === this.DEFAULT_SCENARIO_NAME;
                }));
            }
        });
    }
}
