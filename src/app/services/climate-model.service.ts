import {Injectable} from '@angular/core';
import {Observable, Observer} from "rxjs";
import 'rxjs/Rx';

import { ClimateModel } from '../models/climate-model';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from "../constants";

/*
 * Climate Model Service
 * Returns climate models from API
 */
@Injectable()
export class ClimateModelService {
    private climateModels: Observable<ClimateModel[]>;
    private climateModelObserver: Observer<ClimateModel[]>;

    constructor(private apiHttp: ApiHttp) {}

    public list(): Observable<ClimateModel[]> {
        if (!this.climateModels) {
            this.climateModels = new Observable<ClimateModel[]>(observer => {
                this.climateModelObserver = observer;
            });
        }
        let url = apiHost + '/api/climate-model/';
        this.apiHttp.get(url)
            .map(resp => resp.json())
            .subscribe(resp => this.climateModelObserver.next(resp || [] as ClimateModel[]));
        return this.climateModels;
    }
}

