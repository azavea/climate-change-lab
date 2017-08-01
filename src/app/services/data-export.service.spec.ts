import { DataExportService } from './data-export.service';


describe('CSVService', () => {

    let service: DataExportService;

    beforeEach(() => {
        service = new DataExportService();
    });

    it('should have a downloadAsJSON method', () => {
        expect(service.downloadAsJSON).toBeDefined();
    });
});
