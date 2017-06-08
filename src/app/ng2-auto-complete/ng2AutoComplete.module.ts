import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule  } from '@angular/platform-browser';

import { apiHttpProvider } from '../auth/api-http.provider';
import { AutoComplete } from './auto-complete';
import { AutoCompleteComponent } from './auto-complete.component';
import { AutoCompleteDirective } from './auto-complete.directive';

@NgModule({
  imports: [ BrowserModule, FormsModule ],
  entryComponents: [AutoCompleteComponent],
  declarations: [AutoCompleteComponent, AutoCompleteDirective],
  exports:  [AutoCompleteComponent, AutoCompleteDirective],
  providers: [ AutoComplete, apiHttpProvider ]
})
export class Ng2AutoCompleteModule {}
