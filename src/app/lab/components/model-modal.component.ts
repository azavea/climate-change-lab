import { Component, OnInit, Input } from '@angular/core';

import {} from ''

import { ClimateModel } from '../../models/climate-model.model';
import { ProjectData } from '../../models/project-data.model';
import { ClimateModelService } from '../../services/climate-model.service';

import * as _ from 'lodash';

/*  Model Modal Component
    -- Requires project input
    -- Emits selected model
    Expected use:
        <ccl-model-modal
            [projectData]="your_project.project_data">
*/

@Component({
  selector: 'ccl-model-modal',
  templateUrl: './model-modal.component.html'
})
export class ModelModalComponent implements OnInit {

    @Input() projectData: ProjectData;

    public buttonText: string;
    public climateModels: ClimateModel[] = [];
    public smModal: any;

    constructor(private climateModelService: ClimateModelService) {}

    ngOnInit() {
        this.getClimateModels();
    }

    // unselect all model checkboxes when option to use all models selected
    public clearClimateModels() {
        this.climateModels.forEach(model => model.selected = false);
    }

    // disable models not valid for the project datset
    public disableClimateModels() {
        if (!this.projectData.dataset) {
            return;
        }
        this.climateModels.forEach(model => {
            model.enabled = _.includes(this.projectData.dataset.models, model.name);
        });
    }

    public isModalUpdateButtonDisabled() {
        return this.climateModels.filter(model => model.selected).length === 0;
    }

    public selectAllClimateModels() {
        this.climateModels.forEach(model => model.selected = true);
    }

    public updateProjectClimateModels() {
        this.disableClimateModels();
        this.projectData.models = this.filterSelectedClimateModels();
        this.updateButtonText();
    }

    public modalShow() {
        this.updateProjectClimateModels();
    }

    public modalHide() {
        const models = this.filterSelectedClimateModels();
        if (models.length < 1) {
          this.selectAllClimateModels();
        }
        this.updateProjectClimateModels();
    }

    private filterSelectedClimateModels() {
        return this.climateModels.filter(model => model.selected && model.enabled);
    }

    // subscribe to list of available models from API endpoint
    private getClimateModels() {
        this.climateModelService.list().subscribe(data => {
            this.climateModels = data;

            // Initialize 'selected' attributes with models in project
            if (this.projectData.models.length === 0) {
                this.selectAllClimateModels();
            } else if (this.projectData.dataset) {
                // dataset may be undefined for project if in form to create new project
                this.projectData.models.forEach(projectModel => {
                    this.climateModels.forEach(model => {
                        if (projectModel.name === model.name) {
                           model.selected = projectModel.selected;
                        }
                    });
                });
            }

            this.updateProjectClimateModels();
        });
    }

    private updateButtonText() {
        this.buttonText = this.projectData.models.length ===
            this.projectData.dataset.models.length ? 'All available models' : 'Subset of models';
    }
}
