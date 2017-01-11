import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import * as SaveSvg from 'save-svg-as-png';

/*
 * Generates image of D3 chart SVG and shares it on social media
 */
@Injectable()
export class SocialService {

    // options to pass when converting SVG to PNG
    private chartOptions = {
            backgroundColor: 'white',
            selectorRemap: function(selector) {
                // find CSS selectors mapped to parent chart
                return selector.replace('chart', '');
            }
    };

    /**
     * Converts chart SVG to PNG and downloads it.
     *
     * @param indicatorName {string} Name of indicator; used for both file name and SVG selector
     */
    public downloadAsPNG(indicatorName: string): void {
        let filename: string = indicatorName + '.png';
        let svg: HTMLElement = document.getElementById('chart-' + indicatorName);
        // SVG might not be found if chart hasn't loaded yet
        if (!svg) return;

        SaveSvg.saveSvgAsPng(svg, filename, this.chartOptions);
    }

    public chartSvgToPngUri(indicatorName: string): void {
        let svg: HTMLElement = document.getElementById('chart-' + indicatorName);
        // SVG might not be found if chart hasn't loaded yet
        if (!svg) return;

        SaveSvg.svgAsPngUri(svg, this.chartOptions,
            uri => {
                // TODO: use this PNG data URI for posting image to social media
                console.log(uri);
            });
    }
}
