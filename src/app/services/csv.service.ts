import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import * as Papa from 'papaparse';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';

/*
 * Generates CSV
 */
@Injectable()
export class CSVService {

    public dataToCSV(data): string {
        const label = data[0].indicator.name + '-' + data[0].indicator.default_units;
        const body = _(data[0].data)
                       .map((row) => _.extend({ date: row.date }, row.values))
                       .map((row) => _.mapKeys(row, (value, key) =>
                                                    key === 'date' ? 'date' : label + '-' + key
                                              )).value();
        return Papa.unparse(body);
    }

    public downloadAsCSV(data): void {
        const filename = data[0].indicator.name + '.csv';
        this.downloadFile(this.dataToCSV(data), filename, 'text/csv');
    }

    private downloadFile(data: string, title: string, mime: string): void {
        FileSaver.saveAs(new File([data], title, {type: mime + ';charset=utf-8'}));
    }
}
