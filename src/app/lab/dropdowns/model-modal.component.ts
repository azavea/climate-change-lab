import { Component, OnInit, Input } from '@angular/core';

import { ClimateModel } from '../../models/climate-model';
import { ProjectData } from '../../models/project';
import { ClimateModelService } from '../../services/climate-model.service';

/*  Model Modal Component
    -- Requires project input
    -- Emits selected model
    Expected use:
        <model-modal
            [project]="your_project_data">
*/

@Component({
  selector: 'model-modal',
  templateUrl: './model-modal.component.html'
})
export class ModelModalComponent implements OnInit {

    @Input() project: ProjectData;

    private buttonText: string;
    public climateModels: ClimateModel[] = [];

    constructor(private climateModelService: ClimateModelService) {}

    ngOnInit() {
        this.getClimateModels();
    }

    // unselect all model checkboxes when option to use all models selected
    public clearClimateModels() {
        this.climateModels.forEach(model => model.selected = false);
    }

    public isModalUpdateButtonDisabled() {
        return this.climateModels.filter(model => model.selected).length === 0;
    }

    public selectAllClimateModels() {
        this.climateModels.forEach(model => model.selected = true);
    }

    public updateProjectClimateModels() {
        this.project.models = this.filterSelectedClimateModels();
        this.updateButtonText();
    }

    private filterSelectedClimateModels(isSelected: boolean = true) {
        return this.climateModels.filter(model => model.selected === isSelected);
    }

    public modalHide() {
        let models = this.filterSelectedClimateModels();
        if (models.length < 1) {
          this.selectAllClimateModels();
        }
        this.updateProjectClimateModels();
    }

    // subscribe to list of available models from API endpoint
    private getClimateModels() {
        this.climateModelService.list().subscribe(data => {
            this.climateModels = data;

            // Initialize 'selected' attributes with models in project
            if (this.project.models.length === 0) {
                this.selectAllClimateModels();
                this.updateProjectClimateModels();
            } else {
                this.project.models.forEach(projectModel => {
                    this.climateModels.forEach(model => {
                        if (projectModel.name === model.name) {
                           model.selected = projectModel.selected;
                        }
                    });
                });
            }
            this.updateButtonText();
        });
    }

    private updateButtonText() {
        this.buttonText = this.project.models.length === this.climateModels.length ?
            'All available models' : 'Subset of models';
    }
}
