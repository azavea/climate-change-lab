import { CSVService }    from './csv.service';


describe('CSVService', () => {

    let service: CSVService;

    /* tslint:disable:max-line-length */
    let testData = [{data: [
         {date: 'Sun Jan 01 2006 00:00:00 GMT-0500 (EST)', values: {avg: 1, max: 2, min: 0}},
         {date: 'Mon Jan 01 2007 00:00:00 GMT-0500 (EST)', values: {avg: 42.0, max: 111.1, min: -2.2}}],
        indicator: {name: 'extreme_cold_events'}, time_aggregation: 'yearly', time_format: '%Y'}];

    let testResult = [
        'date,extreme_cold_events-undefined-avg,extreme_cold_events-undefined-max,extreme_cold_events-undefined-min',
        'Sun Jan 01 2006 00:00:00 GMT-0500 (EST),1,2,0',
        'Mon Jan 01 2007 00:00:00 GMT-0500 (EST),42,111.1,-2.2'
    ].join('\r\n');
    /* tslint:enable:max-line-length */

    beforeEach(() => {
        service = new CSVService();
    });

    it('should have a downloadAsCSV method', () => {
        expect(service.downloadAsCSV).toBeDefined();
    });

    it('should convert data to tabular format', () => {
        let tabularData = service.dataToCSV(testData);
        expect(tabularData).toBe(testResult);
    });
});
