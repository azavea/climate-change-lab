import { Component,
         ViewEncapsulation,
         Input } from '@angular/core';

/*
 * Curl Command Component
 * UI to copy a string
 */

@Component({
  selector: 'ccl-copy-curl',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './copy-curl.component.html'
})
export class CopyCurlComponent {

    @Input() label: string;
    @Input() placeholder: string;
    @Input() curl: string;

    constructor() {}

    curlCommandCopied(copiedPopup) {
        // show a confirmation tooltip, then hide it again after a second
        copiedPopup.show();
        setTimeout(() => { copiedPopup.hide(); }, 1000);
    }
}
