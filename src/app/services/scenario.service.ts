import {Injectable} from '@angular/core';
import {Observable, Observer} from "rxjs";
import 'rxjs/Rx';

import { Scenario } from '../models/scenario';
import { ApiHttp } from '../auth/api-http.service';
import { apiHost } from "../constants";

/*
 * Scenario Service
 * Returns scenarios from API
 */
@Injectable()
export class ScenarioService {

    private scenarios: Observable<Scenario[]>;
    private scenarioObserver: Observer<Scenario[]>;

    constructor(private apiHttp: ApiHttp) {}

    public list(): Observable<Scenario[]> {
        if (!this.scenarios) {
            this.scenarios = new Observable<Scenario[]>(observer => this.scenarioObserver = observer);
        }
        let url = apiHost + '/api/scenario/';
        this.apiHttp.get(url)
            .map(resp => resp.json())
            .subscribe(resp => this.scenarioObserver.next(resp || [] as Scenario[]));
        return this.scenarios;
    }
}

