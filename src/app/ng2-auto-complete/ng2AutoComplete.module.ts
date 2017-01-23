import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { XHRBackend, RequestOptions } from '@angular/http';
import { BrowserModule  } from '@angular/platform-browser';

import { AutoComplete } from './auto-complete';
import { AutoCompleteComponent } from './auto-complete.component';
import { AutoCompleteDirective } from './auto-complete.directive';

import { ApiHttp } from '../auth/api-http.service';
import { AuthService } from '../auth/auth.service';

let apiHttpProvider = {
    provide: ApiHttp,
    useFactory: (xhrBackend: XHRBackend,
                 requestOptions: RequestOptions,
                 authService: AuthService) => {
        return new ApiHttp(xhrBackend, requestOptions, authService);
    },
    deps: [XHRBackend, RequestOptions, AuthService]
};

@NgModule({
  imports: [ BrowserModule, FormsModule ],
  entryComponents: [AutoCompleteComponent],
  declarations: [AutoCompleteComponent, AutoCompleteDirective],
  exports:  [AutoCompleteComponent, AutoCompleteDirective],
  providers: [ AutoComplete, apiHttpProvider ]
})
export class Ng2AutoCompleteModule {}
