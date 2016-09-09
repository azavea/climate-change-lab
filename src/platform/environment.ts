// Decorates the angular bootstrapping process depending on the environment selected
// Disables debug tools and enables prod mode if ENV is production

import { enableProdMode } from '@angular/core';
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateComponentRef = function identity(value) { return value; };

if ('production' === ENV) {
  // Production
  disableDebugTools();
  enableProdMode();
} else {
  _decorateComponentRef = (cmpRef) => {
    let _ng = (<any>window).ng;
    enableDebugTools(cmpRef);
    (<any>window).ng.probe = _ng.probe;
    (<any>window).ng.coreTokens = _ng.coreTokens;
    return cmpRef;
  };
}

export const decorateComponentRef = _decorateComponentRef;
