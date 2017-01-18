import {Observable} from "rxjs/Rx";

import { ClimateModelService }    from './climate-model.service';
import { ApiHttp } from '../auth/api-http.service';


describe('ClimateModelService', () => {

    let service: ClimateModelService;

    let apiHttpStub: Object;

    let testResponse = [{"name":"ACCESS1-0","label":"ACCESS1-0","base_time":null},{"name":"BNU-ESM","label":"BNU-ESM","base_time":null},{"name":"CCSM4","label":"CCSM4","base_time":null},{"name":"CESM1-BGC","label":"CESM1-BGC","base_time":null},{"name":"CNRM-CM5","label":"CNRM-CM5","base_time":null},{"name":"CSIRO-Mk3-6-0","label":"CSIRO-Mk3-6-0","base_time":null},{"name":"CanESM2","label":"CanESM2","base_time":null},{"name":"GFDL-CM3","label":"GFDL-CM3","base_time":null},{"name":"GFDL-ESM2G","label":"GFDL-ESM2G","base_time":null},{"name":"GFDL-ESM2M","label":"GFDL-ESM2M","base_time":null},{"name":"IPSL-CM5A-LR","label":"IPSL-CM5A-LR","base_time":null},{"name":"IPSL-CM5A-MR","label":"IPSL-CM5A-MR","base_time":null},{"name":"MIROC-ESM-CHEM","label":"MIROC-ESM-CHEM","base_time":null},{"name":"MIROC-ESM","label":"MIROC-ESM","base_time":null},{"name":"MIROC5","label":"MIROC5","base_time":null},{"name":"MPI-ESM-LR","label":"MPI-ESM-LR","base_time":null},{"name":"MPI-ESM-MR","label":"MPI-ESM-MR","base_time":null},{"name":"MRI-CGCM3","label":"MRI-CGCM3","base_time":null},{"name":"NorESM1-M","label":"NorESM1-M","base_time":null},{"name":"bcc-csm1-1","label":"bcc-csm1-1","base_time":null},{"name":"inmcm4","label":"inmcm4","base_time":null}];

    beforeEach(() => {
        apiHttpStub = {
            get: jasmine.createSpy('get').and.returnValue(Observable.of({json => { return testResponse;}}));
        };
        service = new ClimateModelService(apiHttpStub);
    });

    it('should have a list method', () => {
        expect(service.list).toBeDefined();
    });

    it('should list climate models', () => {
        let list = service.list();
        expect(apiHttpStub.get).toHaveBeenCalled();

        list.subscribe(data => {
            expect(data.length).toBe(21);
        });
    });
});
