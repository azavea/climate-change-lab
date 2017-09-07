import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import * as FileSaver from 'file-saver';

/*
 * Generates CSV
 */
@Injectable()
export class DataExportService {

    public downloadAsJSON(data): void {
        const filename = data.indicator.name + '.json';
        this.downloadFile(JSON.stringify(data), filename, 'application/json');
    }

    private downloadFile(data: string, title: string, mime: string): void {
        FileSaver.saveAs(new File([data], title, {type: mime + ';charset=utf-8'}));
    }
}
