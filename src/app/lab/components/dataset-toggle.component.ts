import { Component, OnInit, Input } from '@angular/core';

import { Dataset } from '../../models/dataset.model';
import { ProjectData } from '../../models/project-data.model';
import { DatasetService } from '../../services/dataset.service';

import * as _ from 'lodash';

/*  Dataset Toggle Component

    -- Requires project input
    Expected use:
        <ccl-dataset-toggle
            [projectData]="your_project.project_data">
*/

@Component({
  selector: 'ccl-dataset-toggle',
  template: `
    <div class="dropdown button-group">
        <button class="button"
               *ngFor="let s of datasets"
               [disabled]="!checkValidDataset(s)"
               [ngClass]="{'active': s.name === projectData.dataset.name}"
               (click)="onDatasetSelected(s, $event)">
            {{ s.name }}
        </button>
    </div>
  `

})
export class DatasetToggleComponent implements OnInit {

    @Input() projectData: ProjectData;
    public datasets: Dataset[] = [];
    private DEFAULT_DATASET_NAME = 'NEX-GDDP';

    constructor(private datasetService: DatasetService) {}

    ngOnInit() {
        this.getDatasets();
    }

    public onDatasetSelected(dataset: Dataset, event?: Event) {
        if (!this.isValidDataset(dataset)) {
            this.selectDefaultDataset();
        }
        this.projectData.dataset = dataset;
        this.projectData.models.forEach(model => {
            model.enabled = _.includes(dataset.models, model.name);
        });

        if (event) {
            event.preventDefault();
        }
    }

    // set to default, or first valid option for the selected city
    private selectDefaultDataset() {
        let dataset = this.datasets.find(s => s.name === this.DEFAULT_DATASET_NAME);

        // if the standard default dataset is not valid, use first valid option
        if (!this.isValidDataset(dataset)) {
            dataset = this.datasets.find(s => this.isValidDataset(s));
        }

        this.onDatasetSelected(dataset);
    }

    // check if a given dataset is valid and change it if not and it is selected
    public checkValidDataset(dataset: Dataset): boolean {
        const isValid = this.isValidDataset(dataset);
        if (!isValid && this.projectData.dataset &&
            this.projectData.dataset.name === dataset.name) {
            // If this dataset is selected but not valid, change to a valid dataset.
            // Do so within a timeout to avoid change detection errors.
            setTimeout(() => this.selectDefaultDataset());
        }
        return isValid;
    }

    // helper that checks if a given dataset is available for the currently selected city
    public isValidDataset(dataset: Dataset): boolean {
        if (!this.projectData.city.properties) {
            return true; // city properties may be undefined in form to create new project
        }
        return _.includes(this.projectData.city.properties.datasets, dataset.name);
    }

    private getDatasets() {
        this.datasetService.list().subscribe(data => {
            this.datasets = data;

            // Set a default for the project if none is set
            if (!this.projectData.dataset) {
                this.selectDefaultDataset();
            }
        });
    }
}
