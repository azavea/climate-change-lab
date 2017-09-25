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
               [disabled]="!isValidDataset(s)"
               [ngClass]="{'active': s.name === projectData.dataset.name}"
               (click)="onDatasetClicked(s, $event)">
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

    public onDatasetClicked(dataset: Dataset, event?: Event) {
        this.projectData.dataset = dataset;
        this.projectData.models.forEach(model => {
            model.enabled = _.includes(dataset.models, model.name);
        });

        if (event) {
            event.preventDefault();
        }
    }

    // helper that checks if a given dataset is available for the currently selected city
    public isValidDataset(dataset: Dataset): boolean {
        return _.includes(this.projectData.city.properties.datasets, dataset.name);
    }

    private getDatasets() {
        this.datasetService.list().subscribe(data => {
            this.datasets = data;

            // Set a default for the project if none is set
            if (!this.projectData.dataset) {
                this.onDatasetClicked(this.datasets.find((s) => {
                    return s.name === this.DEFAULT_DATASET_NAME;
                }));
            }
        });
    }
}
