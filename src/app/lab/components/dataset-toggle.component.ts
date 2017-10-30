import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { City, ClimateModel, Dataset, DatasetService } from 'climate-change-components';

import * as _ from 'lodash';

/*  Dataset Toggle Component

    -- Requires project input
    Expected use:
        <ccl-dataset-toggle
            [city]="selectedCity"
            [dataset]="yourDataset"
            [models]="selectedModels"
            (onDatasetSelected)="datasetSelected($event)">
*/

@Component({
  selector: 'ccl-dataset-toggle',
  templateUrl: './dataset-toggle.component.html'
})
export class DatasetToggleComponent implements OnInit {

    @Input() city: City;
    @Input() dataset: Dataset;
    @Input() models: ClimateModel[];
    @Output() onDatasetSelected = new EventEmitter<Dataset>();
    public datasets: Dataset[] = [];
    private DEFAULT_DATASET_NAME = 'NEX-GDDP';

    constructor(private datasetService: DatasetService) {}

    ngOnInit() {
        this.getDatasets();
    }

    public onDatasetClicked(dataset: Dataset, event?: Event) {
        if (!this.isValidDataset(dataset)) {
            this.selectDefaultDataset();
        }
        this.dataset = dataset;
        this.models.forEach(model => {
            model.enabled = _.includes(dataset.models, model.name);
        });

        if (event) {
            event.preventDefault();
        }
        this.onDatasetSelected.emit(dataset);
    }

    // set to default, or first valid option for the selected city
    private selectDefaultDataset() {
        let dataset = this.datasets.find(s => s.name === this.DEFAULT_DATASET_NAME);

        // if the standard default dataset is not valid, use first valid option
        if (!this.isValidDataset(dataset)) {
            dataset = this.datasets.find(s => this.isValidDataset(s));
        }

        this.onDatasetClicked(dataset);
    }

    // check if a given dataset is valid and change it if not and it is selected
    public checkValidDataset(dataset: Dataset): boolean {
        const isValid = this.isValidDataset(dataset);
        if (!isValid && this.dataset &&
            this.dataset.name === dataset.name) {
            // If this dataset is selected but not valid, change to a valid dataset.
            // Do so within a timeout to avoid change detection errors.
            setTimeout(() => this.selectDefaultDataset());
        }
        return isValid;
    }

    // helper that checks if a given dataset is available for the currently selected city
    public isValidDataset(dataset: Dataset): boolean {
        if (!this.city.properties) {
            return true; // city properties may be undefined in form to create new project
        }
        return _.includes(this.city.properties.datasets, dataset.name);
    }

    private getDatasets() {
        this.datasetService.list().subscribe(data => {
            this.datasets = data;

            // Set a default for the project if none is set
            if (!this.dataset) {
                this.selectDefaultDataset();
            }
        });
    }
}
